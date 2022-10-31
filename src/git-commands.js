const { spawnSync } = require('child_process');
const core = require('@actions/core');

const gitSpawnOptions = {
  maxBuffer: Infinity
};

function git(command, args) {
  args = args || [];
  const processResult = spawnSync('git', [command, ...args], gitSpawnOptions);
  if (processResult.status !== 0) throw new Error('Failed running git.');
  return processResult.stdout.toString().trim();
}

module.exports = {
  /**
   * @returns {string[]}
   */
  listTags: (prefix, fallbackToNoPrefixSearch) => {
    let args;
    if (prefix && prefix.length > 0) {
      args = ['-l', `${prefix}*`];
      core.info(`Searching for tags with prefix '${prefix}'...`);
    } else {
      args = [];
      core.info(`Searching for tags...`);
    }

    try {
      let tags = git('tag', args);

      if (!tags) {
        if (fallbackToNoPrefixSearch) {
          core.info(
            `No tags were found with the prefix '${prefix}'.  Falling back to searching with no prefix...`
          );
          tags = git('tag');
        }

        if (!tags) {
          const noTagsMsg =
            'There do not appear to be any tags on the repository.  If that is not accurate, ensure fetch-depth: 0 is set on the checkout action.';
          core.warning(noTagsMsg);
          return [];
        }
      }

      core.info(`The following tags exist on the repository:\n${tags}\n`);
      return tags.split('\n').map(t => t.trim());
    } catch (error) {
      core.setFailed(`An error occurred listing the tags for the repository: ${error.message}`);
    }
  },

  /**
   * @returns {boolean} true when ancestorCommitish is in the history of descendantCommitish
   */
  isAncestor: (ancestorCommitish, descendantCommitish) => {
    let processResult = spawnSync('git', [
      'merge-base',
      '--is-ancestor',
      ancestorCommitish,
      descendantCommitish
    ]);
    if (processResult.status === 0) {
      return true;
    } else if (processResult.status !== 1) {
      throw new Error('Failed running git.');
    }
  },

  /**
   * @returns {{abbreviatedCommitHash: string, authorDate: Date, committerDate: Date}}
   */
  commitMetadata: committish => {
    // abbreviated commit hash
    // author date, UNIX timestamp
    // committer date, UNIX timestamp
    const gitOutput = git('log', ['-1', '--format=%h%n%at%n%ct', committish]);
    const lines = gitOutput.split('\n');
    const shortHash = lines[0];
    const authorDate = new Date(+(lines[1] + '000'));
    const committerDate = new Date(+(lines[2] + '000'));
    return {
      abbreviatedCommitHash: shortHash,
      authorDate,
      committerDate
    };
  },

  logBetween: (baseCommittish, finalCommittish) => {
    const gitOutput = git('log', [
      `${baseCommittish}..${finalCommittish}`,
      '--format=%H%x1d%h%x1d%an%x1d%ae%x1d%at%x1d%cn%x1d%ce%x1d%ct%x1d%B%x1d%N%x1e'
    ]);
    const commits = gitOutput.split('\x1e');
    return commits.map(commit => {
      let props = commit.split('\x1d');
      return {
        commitHash: props[0],
        abbreviatedCommitHash: props[1],
        authorName: props[2],
        authorEmail: props[3],
        authorDate: new Date(+(props[4] + '000')),
        committerName: props[5],
        committerEmail: props[6],
        committerDate: new Date(+(props[7] + '000')),
        rawBody: props[8],
        commitNotes: props[9]
      };
    });
  }
};
