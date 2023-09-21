const core = require('@actions/core');

const { nextReleaseVersion, nextPrereleaseVersion } = require('./version');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const calculatePrereleaseVersion = core.getBooleanInput('calculate-prerelease-version');
const defaultReleaseType = core.getInput('default-release-type', requiredArgOptions).toLowerCase();
const fallbackToNoPrefixSearch = core.getBooleanInput('fallback-to-no-prefix-search');
let tagPrefix = core.getInput('tag-prefix');

if (tagPrefix.toLowerCase() == 'none') {
  tagPrefix = ''; //action.yml sets it to v by default so the user wouldn't be able to set an empty string themselves.
}

async function run() {
  try {
    const expectedReleaseTypes = ['major', 'minor', 'patch'];

    if (!expectedReleaseTypes.includes(defaultReleaseType)) {
      core.setFailed('The default release type must be set to major|minor|patch');
      return;
    }

    let versionToBuild;
    if (calculatePrereleaseVersion) {
      const branchName = core.getInput('branch-name', requiredArgOptions); // Leave this here so it can be "required"
      core.info(`Calculating a pre-release version for ${branchName}...`);

      //This regex will strip out anything that's not a-z, 0-9 or the - character
      const prereleaseLabel = branchName.replace('refs/heads/', '').replace(/[^a-zA-Z0-9-]/g, '-');
      versionToBuild = nextPrereleaseVersion(
        prereleaseLabel,
        defaultReleaseType,
        tagPrefix,
        fallbackToNoPrefixSearch
      );
    } else {
      core.info(`Calculating a release version...`);
      versionToBuild = nextReleaseVersion(defaultReleaseType, tagPrefix, fallbackToNoPrefixSearch);
    }

    const { nextVersion, priorVersion } = versionToBuild;

    const outputVersionEntries = Object.entries({
      NEXT_VERSION: nextVersion.toString(),
      NEXT_MINOR_VERSION: `${nextVersion.major}.${nextVersion.minor}`,
      NEXT_MAJOR_VERSION: nextVersion.major,
      PRIOR_VERSION: priorVersion.toString()
    });

    core.info(`\nFinished examining the git history.  The following outputs will be set:`);
    [
      ...outputVersionEntries.map(([name, value]) => [name, `${tagPrefix}${value}`]),
      ...outputVersionEntries.map(([name, value]) => [`${name}_NO_PREFIX`, value])
    ].forEach(entry => {
      core.setOutput(...entry);
      core.exportVariable(...entry);
      console.info(...entry);
    });
  } catch (error) {
    const versionTxt = calculatePrereleaseVersion ? 'pre-release' : 'release';
    core.setFailed(
      `An error occurred calculating the next ${versionTxt} version: ${error.message}`
    );
  }
}
run();
