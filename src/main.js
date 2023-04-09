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
const fallbackToNoPrefixSearch = core.getBooleanInput('fallback-to-no-prefix-search');
let tagPrefix = core.getInput('tag-prefix');

async function createRefOnGitHub(versionToBuild, sha) {
  core.info('Creating the ref on GitHub...');

  // This arg is only required when creating a ref, so get the input here.
  const token = core.getInput('github-token', requiredArgOptions);
  const octokit = github.getOctokit(token);

  await octokit.rest.git
    .createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/tags/${versionToBuild}`,
      sha
    })
    .then(() => {
      core.info('Finished creating the ref on GitHub.');
    })
    .catch(error => {
      core.setFailed(`An error occurred creating the ref on GitHub: ${error.message}`);
    });
}

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
    core.info(`Tag Prefix: '${tagPrefix}'`);

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

    // TODO: generate the sha from head https://github.com/im-open/git-version-lite/issues/24
    const sha =
      github.context.eventName === 'pull_request'
        ? github.context.payload.pull_request.head.sha
        : github.context.sha;

    if (createRef) {
      await createRefOnGitHub(versionToBuild, sha);
    }

    const { nextVersion, priorVersion } = versionToBuild;

    const outputVersionEntries = Object.entries({
      NEXT_VERSION: nextVersion.toString(),
      NEXT_MINOR_VERSION: `${nextVersion.major}.${nextVersion.minor}`,
      NEXT_MAJOR_VERSION: nextVersion.minor,
      PRIOR_VERSION: priorVersion.toString()
    });

    [
      ['NEXT_VERSION_SHA', sha],

      ...outputVersionEntries
        .map(([name, value]) => [name, `${tagPrefix}${value}`]),

      ...outputVersionEntries
        .map(([name, value]) => [`${name}_NO_PREFIX`, value])
    ]
      .forEach(entry => {
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
