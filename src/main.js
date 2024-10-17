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

function setTheOutputs(name, value, tagPrefix) {
  // Set the regular version (it has a tag prefix)
  const valueWithTag = `${tagPrefix}${value}`;
  core.setOutput(name, valueWithTag);
  core.exportVariable(name, valueWithTag);
  core.info(`${name}: ${valueWithTag}`);

  // Set the version without the tag prefix
  const noPrefixName = `${name}_NO_PREFIX`;
  core.setOutput(noPrefixName, value);
  core.exportVariable(noPrefixName, value);
  core.info(`${noPrefixName}: ${value}`);
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

    console.log('version to build:');
    console.log(versionToBuild);

    const { nextPatch, nextMinor, nextMajor, priorVersion, nextPatchReleaseVersion } =
      versionToBuild;
    setTheOutputs('PRIOR_VERSION', priorVersion, tagPrefix);
    setTheOutputs('NEXT_VERSION', nextPatch, tagPrefix);
    setTheOutputs('NEXT_MINOR_VERSION', nextMinor, tagPrefix);
    setTheOutputs('NEXT_MAJOR_VERSION', nextMajor, tagPrefix);
    setTheOutputs('NEXT_RELEASE_VERSION', nextPatchReleaseVersion, tagPrefix);
  } catch (error) {
    const versionTxt = calculatePrereleaseVersion ? 'pre-release' : 'release';
    core.setFailed(
      `An error occurred calculating the next ${versionTxt} version: ${error.message}`
    );
  }
}
run();
