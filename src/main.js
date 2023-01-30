const core = require('@actions/core');
const github = require('@actions/github');

const { nextReleaseVersion, nextPrereleaseVersion } = require('./version');

// When used, this requiredArgOptions will cause the action to error if a value has not been provided.
const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const calculatePrereleaseVersion = core.getBooleanInput('calculate-prerelease-version');
const defaultReleaseType = core.getInput('default-release-type', requiredArgOptions).toLowerCase();
const createRef = core.getBooleanInput('create-ref');
const includeMajorRelease = core.getBooleanInput('include-major-release');
const fallbackToNoPrefixSearch = core.getBooleanInput('fallback-to-no-prefix-search');
let tagPrefix = core.getInput('tag-prefix');

async function run() {
  try {
    const expectedReleaseTypes = ['major', 'minor', 'patch'];

    if (!expectedReleaseTypes.includes(defaultReleaseType)) {
      core.setFailed('The default release type must be set to major|minor|patch');
      return;
    }

    //action.yml sets it to v by default so the user wouldn't be able to set an empty string themselves.
    if (tagPrefix.toLowerCase() == 'none') {
      tagPrefix = '';
    }

    let versionToBuild;
    if (calculatePrereleaseVersion) {
      const branchName = core.getInput('branch-name', requiredArgOptions);
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

    if (createRef) {
      const token = core.getInput('github-token', requiredArgOptions);
      const octokit = github.getOctokit(token);

      await createRefOnGitHub(octokit, versionToBuild);

      if (includeMajorRelease && !calculatePrereleaseVersion) {
        const majorVersion = versionToBuild.split('.')[0];
        await createRefOnGitHub(octokit, majorVersion, false);
        core.setOutput('MAJOR_VERSION', majorVersion);
        core.setOutput('MAJOR_VERSION_NO_PREFIX', majorVersion.substring(tagPrefix.length));
      }
    }

    core.setOutput('NEXT_VERSION', versionToBuild);
    core.exportVariable('NEXT_VERSION', versionToBuild);

    let versionToBuildNoPrefix =
      tagPrefix.length > 0 ? versionToBuild.substring(tagPrefix.length) : versionToBuild;
    core.setOutput('NEXT_VERSION_NO_PREFIX', versionToBuildNoPrefix);
    core.exportVariable('NEXT_VERSION_NO_PREFIX', versionToBuildNoPrefix);
  } catch (error) {
    const versionTxt = calculatePrereleaseVersion ? 'pre-release' : 'release';
    core.setFailed(
      `An error occurred calculating the next ${versionTxt} version: ${error.message}`
    );
  }
}
run();
