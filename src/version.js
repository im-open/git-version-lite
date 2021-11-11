const git = require('./git-commands.js');
const core = require('@actions/core');
const semver = require('semver');

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
  // look at git log messages since then for breaking changes or new features
  const commitObjects = git.logBetween(baseCommit, finalCommit);
  let releaseType = 'patch';
  for (let i = 0; i < commitObjects.length; i++) {
    const commitObj = commitObjects[i];

    if (
      commitPatterns.major.some(
        pattern => pattern.test(commitObj.rawBody) || pattern.test(commitObj.commitNotes)
      )
    ) {
      releaseType = 'major';
      core.info('The following comment body or notes match the major pattern:');
      if (commitObj.rawBody && commitObj.rawBody.length > 0)
        core.info(`\tBody:"${commitObj.rawBody.trim()}"`);
      if (commitObj.commitNotes && commitObj.commitNotes.length > 0)
        core.info(`\tNotes:"${commitObj.commitNotes.trim()}"`);
      break;
    }
    if (
      commitPatterns.minor.some(
        pattern => pattern.test(commitObj.rawBody) || pattern.test(commitObj.commitNotes)
      )
    ) {
      releaseType = 'minor';
      core.info('The following comment body or notes match the minor pattern:');
      if (commitObj.rawBody && commitObj.rawBody.length > 0)
        core.info(`\tBody:"${commitObj.rawBody.trim()}"`);
      if (commitObj.commitNotes && commitObj.commitNotes.length > 0)
        core.info(`\tNotes:"${commitObj.commitNotes.trim()}"`);
    }
  }
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
 * @param defaultReleaseType {string} The default release type to use if no tags are detected
 * @param tagPrefix {string} The value to pre-pend to the calculated release
 * @returns {string} a SemVer release version based on the Git history since the last tagged release
 */
function nextReleaseVersion(defaultReleaseType, tagPrefix, fallbackToNoPrefixSearch) {
  let baseCommit;
  try {
    // start from the most-recent release version
    baseCommit = getPriorReleaseCommit(tagPrefix, fallbackToNoPrefixSearch);
  } catch (error) {
    core.info(`An error occurred retrieving the tags for the repository: ${error}`);
  }

  let priorReleaseVersion;
  let releaseType;
  if (baseCommit === null) {
    priorReleaseVersion = '0.0.0';
    releaseType = defaultReleaseType;
    core.info(`\nPrior release version default: ${priorReleaseVersion}`);
    core.info(`Release Type: ${releaseType}`);
  } else {
    priorReleaseVersion = baseCommit.semver;
    releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
    core.info(`\nPrior release version: ${priorReleaseVersion}`);
    core.info(`Release Type: ${releaseType}`);
  }

  let nextReleaseVersion = `${tagPrefix}${semver.inc(priorReleaseVersion, releaseType)}`;
  core.info(`Tag Prefix: '${tagPrefix}'`);
  core.info(`Next Release Version: ${nextReleaseVersion}`);

  return nextReleaseVersion;
}

/**
 * @param label {string} The pre-release label
 * @param defaultReleaseType {string} The default release type to use if no tags are detected
 * @param tagPrefix {string} The value to pre-pend to the calculated release
 * @returns {string} a SemVer pre-release version based on the Git history since the last tagged release
 */
function nextPrereleaseVersion(label, defaultReleaseType, tagPrefix, fallbackToNoPrefixSearch) {
  let baseCommit;
  try {
    // start from the most-recent release version
    baseCommit = getPriorReleaseCommit(tagPrefix, fallbackToNoPrefixSearch);
  } catch (error) {
    core.info(`An error occurred retrieving the tags for the repository: ${error}`);
  }
  let currentHeadCommit = git.commitMetadata('HEAD');

  let formattedDate = dateToPreReleaseComponent(currentHeadCommit.committerDate);

  let priorReleaseVersion;
  let releaseType;
  if (baseCommit === null) {
    priorReleaseVersion = '0.0.0';
    releaseType = defaultReleaseType;
    core.info(`\nPrior release version default: ${priorReleaseVersion}`);
    core.info(`Release Type: ${releaseType}`);
  } else {
    priorReleaseVersion = baseCommit.semver;
    releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
    core.info(`\nPrior release version: ${priorReleaseVersion}`);
    core.info(`Release Type: ${releaseType}`);
  }
  let nextReleaseVersion = semver.inc(priorReleaseVersion, releaseType);
  let prereleaseVersion = `${tagPrefix}${nextReleaseVersion}-${label}.${formattedDate}`;
  core.info(`Tag Prefix: '${tagPrefix}'`);
  core.info(`Cleaned Branch Name: '${label}'`);
  core.info(`Next Pre-release Version: ${prereleaseVersion}`);

  return prereleaseVersion;
}

module.exports = {
  nextReleaseVersion,
  nextPrereleaseVersion
};
