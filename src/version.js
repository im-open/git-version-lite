const git = require('./git-commands.js');
const core = require('@actions/core');
const semver = require('semver');
const SemVer = require('semver/classes/semver');

// These commit message patterns are a combination of GitVersion's commit message conventions and
// Angular's which seem to be widely immitated including in semantic-release.
const commitPatterns = {
  major: [
    /\+semver:\s*(breaking|major)/i, // e.g. +semver:breaking, +semver.major
    /BREAKING CHANGES?:?/ // e.g. BREAKING CHANGE:, BREAKING CHANGES
  ],
  minor: [
    /\+semver:\s*(feature|minor)/i, // e.g. +semver:feature, +semver:minor
    /feat\([^)]*\):\s/, // e.g. feat(area): something, feat(): something
    /feature\([^)]*\):\s/, // e.g. feature(area): something, feature(): something
    /^feat:\s.+/m, // e.g. feat: something (at the beginning of a line)
    /^feature:\s.+/m // e.g. feature: something (at the beginning of a line)
  ]
};

/**
 * Returns an object describing the commit of the prior release by looking for the most recent tag that is a "stable" semver
 * @returns {{abbreviatedCommitHash: string, authorDate: Date, committerDate: Date, semver: string}}
 */
function getPriorReleaseCommit(tagPrefix, fallbackToNoPrefixSearch) {
  // get all the tags in the repository that represent semver release versions, sorted with the highest release version first.
  let tags = git.listTags(tagPrefix, fallbackToNoPrefixSearch);
  if (!tags || tags.length === 0) {
    return null;
  }

  const semverReleaseTags = tags
    .map(tag => ({
      tag: tag,
      semverValue: semver.clean(tag.startsWith(tagPrefix) ? tag.slice(tagPrefix.length) : tag, true)
    }))
    // only keep the ones that look like semver release versions
    .filter(tagObj => tagObj.semverValue !== null && semver.prerelease(tagObj.semverValue) === null)
    .sort((a, b) => semver.rcompare(a.semverValue, b.semverValue));

  for (let i = 0; i < semverReleaseTags.length; i++) {
    const candidateTagObj = semverReleaseTags[i];
    if (git.isAncestor(candidateTagObj.tag, 'HEAD')) {
      const commitMetadata = git.commitMetadata(candidateTagObj.tag);
      return {
        ...commitMetadata,
        semver: candidateTagObj.semverValue
      };
    } else {
      core.info(`Skipping ${candidateTagObj.tag} because it is not an ancestor of HEAD`);
    }
  }
  return null;
}

/**
 *
 * @param {string} baseCommit a "commit-ish" string identifying the commit of the prior release
 * @param {string} finalCommit a "commit-ish" string identifying the commit of the new release
 */
function determineReleaseTypeFromGitLog(baseCommit, finalCommit) {
  // look at git log messages since the base commit for breaking changes or new features
  const commitObjects = git.logBetween(baseCommit, finalCommit);
  let releaseType = 'patch';
  core.info('\nExamine commits to determine release type...');

  for (let i = 0; i < commitObjects.length; i++) {
    const commitObj = commitObjects[i];
    const body = commitObj.rawBody ? commitObj.rawBody.trim() : '';
    const notes = commitObj.commitNotes ? commitObj.commitNotes.trim() : '';

    core.info(`--------------------------------------------------------------------------`);
    core.startGroup(`Examine commit ${commitObj.abbreviatedCommitHash}`);
    core.info(`RAW BODY: "${body}"`);
    core.info(`\nCOMMIT NOTES: "${notes}"`);

    if (commitPatterns.major.some(pattern => pattern.test(body) || pattern.test(notes))) {
      releaseType = 'major';
      core.info('\nThe comment body or notes match the major pattern.');
      core.endGroup();
      break;
    }
    if (commitPatterns.minor.some(pattern => pattern.test(body) || pattern.test(notes))) {
      releaseType = 'minor';
      core.info('\nThe comment body or notes match the minor pattern.');
      core.endGroup();
      // Don't break in here (like the major case above) so we can examine the remaining commits.
    } else {
      core.info('\nThe comment body does not match the major or minor pattern.');
      core.endGroup();
    }
  }
  core.info(`--------------------------------------------------------------------------`);
  core.info(
    `Finished examining commits.  Setting Release Type to '${releaseType}' based on git log.`
  );
  return releaseType;
}

function twoDigit(number) {
  return ('0' + number.toString()).slice(-2);
}

/**
 *
 * @param {Date} input
 * @returns {string}
 */
function dateToPreReleaseComponent(input) {
  let year = input.getFullYear() % 100;
  let month = input.getMonth() + 1;
  let day = input.getDate();
  let hour = input.getHours();
  let minute = input.getMinutes();
  let second = input.getSeconds();
  return `${twoDigit(year)}${twoDigit(month)}${twoDigit(day)}${twoDigit(hour)}${twoDigit(
    minute
  )}${twoDigit(second)}`;
}

/**
 * @typedef {{
 *  priorVersion: SemVer,
 *  nextVersion: SemVer
 * }} ReleaseBucket
 */

/**
 * @param defaultReleaseType {string} The default release type to use if no tags are detected
 * @param tagPrefix {string} The value to pre-pend to the calculated release
 * @returns {ReleaseBucket} a SemVer next and prior versions based on the Git history since the last tagged release
 */
function nextReleaseVersion(defaultReleaseType, tagPrefix, fallbackToNoPrefixSearch) {
  let baseCommit;
  try {
    // start from the most-recent release version
    baseCommit = getPriorReleaseCommit(tagPrefix, fallbackToNoPrefixSearch);
  } catch (error) {
    core.info(`An error occurred retrieving the tags for the repository: ${error.message}`);
  }

  let priorReleaseVersion;
  let releaseType;
  if (baseCommit === null) {
    priorReleaseVersion = '0.0.0';
    releaseType = defaultReleaseType;
    core.info(
      `\nThe base commit was empty.  Use the default for prior release version: ${priorReleaseVersion}`
    );
    core.info(`\nSetting Release Type to '${releaseType}' based on empty base commit.`);
  } else {
    priorReleaseVersion = baseCommit.semver;
    core.info(`\nThe base commit was found.  The prior release version is: ${priorReleaseVersion}`);
    releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
  }

  return {
    priorVersion: new SemVer(priorReleaseVersion),
    nextVersion: new SemVer(semver.inc(priorReleaseVersion, releaseType))
  };
}

/**
 * @param label {string} The pre-release label
 * @param defaultReleaseType {string} The default release type to use if no tags are detected
 * @param tagPrefix {string} The value to pre-pend to the calculated release
 * @returns {ReleaseBucket} a pre-release next and prior versions based on the Git history since the last tagged release
 */
function nextPrereleaseVersion(label, defaultReleaseType, tagPrefix, fallbackToNoPrefixSearch) {
  let baseCommit;
  try {
    // start from the most-recent release version
    baseCommit = getPriorReleaseCommit(tagPrefix, fallbackToNoPrefixSearch);
  } catch (error) {
    core.info(`An error occurred retrieving the tags for the repository: ${error.message}`);
  }
  let currentHeadCommit = git.commitMetadata('HEAD');

  let formattedDate = dateToPreReleaseComponent(currentHeadCommit.committerDate);

  let priorReleaseVersion;
  let releaseType;
  if (baseCommit === null) {
    priorReleaseVersion = '0.0.0';
    releaseType = defaultReleaseType;
    core.info(
      `\nThe base commit was empty.  Use the default for prior release version: ${priorReleaseVersion}`
    );
    core.info(`\nSetting Release Type to '${releaseType}' based on empty base commit.`);
  } else {
    priorReleaseVersion = baseCommit.semver;
    core.info(`\nThe base commit was found.  The prior release version is: ${priorReleaseVersion}`);
    releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
  }
  let nextReleaseVersion = semver.inc(priorReleaseVersion, releaseType);
  let prereleaseVersion = `${nextReleaseVersion}-${label}.${formattedDate}`;
  core.info(`Cleaned Branch Name: '${label}'`);

  return {
    priorVersion: new SemVer(priorReleaseVersion),
    nextVersion: new SemVer(prereleaseVersion)
  };
}

module.exports = {
  nextReleaseVersion,
  nextPrereleaseVersion
};
