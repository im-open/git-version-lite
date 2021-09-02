const core = require('@actions/core');

const { nextReleaseVersion, nextPrereleaseVersion } = require('./version');

const calculatePrereleaseVersion = core.getInput('calculate-prerelease-version') === 'true';
const branchName = core.getInput('branch-name');
const defaultReleaseType = core.getInput('default-release-type').toLowerCase();
const tagPrefix = core.getInput('tag-prefix') || '';

function run() {
  try {
    if (
      defaultReleaseType !== 'major' &&
      defaultReleaseType != 'minor' &&
      defaultReleaseType != 'patch'
    ) {
      core.setFailed('The default release type must be populated and set to major|minor|patch');
      return;
    }

    let versionToBuild;
    if (calculatePrereleaseVersion) {
      if (!branchName || branchName.length === 0) {
        core.setFailed('The branch name is required when calculating a pre-release version');
        return;
      }

      core.info(`Calculating a pre-release version for ${branchName}...`);

      //This regex will strip out anything that's not a-z, 0-9 or the - character
      const prereleaseLabel = branchName.replace('refs/heads/', '').replace(/[^a-zA-Z0-9-]/g, '-');
      versionToBuild = nextPrereleaseVersion(prereleaseLabel, defaultReleaseType, tagPrefix);
    } else {
      core.info(`Calculating a release version...`);
      versionToBuild = nextReleaseVersion(defaultReleaseType, tagPrefix);
    }

    core.setOutput('VERSION', versionToBuild);
    core.exportVariable('VERSION', versionToBuild);
  } catch (error) {
    core.setFailed(
      `An error occurred calculating the next ${
        calculatePrereleaseVersion ? 'pre-release' : 'release'
      } version: ${error}`
    );
  }
}
run();
