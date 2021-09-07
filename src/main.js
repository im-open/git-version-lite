const core = require('@actions/core');
const github = require('@actions/github');

const { nextReleaseVersion, nextPrereleaseVersion } = require('./version');

const calculatePrereleaseVersion = core.getInput('calculate-prerelease-version') === 'true';
const branchName = core.getInput('branch-name');
const defaultReleaseType = core.getInput('default-release-type').toLowerCase();
const createRef = core.getInput('create-ref') === 'true';
const token = core.getInput('github-token');
let tagPrefix = core.getInput('tag-prefix');

async function createRefOnGitHub(versionToBuild) {
  core.info('Creating the ref on GitHub...');
  if (!token || token.length === 0) {
    core.setFailed('The token is required when creating a ref');
    return;
  }

  const octokit = github.getOctokit(token);

  let git_sha =
    github.context.eventName === 'pull_request'
      ? github.context.payload.pull_request.head.sha
      : github.context.sha;

  try {
    await octokit.rest.git.createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/tags/${versionToBuild}`,
      sha: git_sha
    });
    core.info('Finished creating the ref on GitHub.');
  } catch (error) {
    core.setFailed(`An error occurred creating the ref on GitHub: ${error}`);
  }
}
async function run() {
  try {
    if (
      defaultReleaseType !== 'major' &&
      defaultReleaseType != 'minor' &&
      defaultReleaseType != 'patch'
    ) {
      core.setFailed('The default release type must be populated and set to major|minor|patch');
      return;
    }

    //action.yml sets it to v by default so the user wouldn't be able to set an empty string themselves.
    if (tagPrefix.toLowerCase() == 'none') {
      tagPrefix = '';
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

    if (createRef) {
      await createRefOnGitHub(versionToBuild);
    }

    core.setOutput('VERSION', versionToBuild);
    core.exportVariable('VERSION', versionToBuild);
  } catch (error) {
    const versionTxt = calculatePrereleaseVersion ? 'pre-release' : 'release';
    core.setFailed(`An error occurred calculating the next ${versionTxt} version: ${error}`);
  }
}
run();
