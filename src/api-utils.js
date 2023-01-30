import * as core from '@actions/core';
import { context } from '@actions/github';

async function tagExists(octokit, tag) {
  try {
      const { data } = await octokit.git.getRef({
          ...context.repo,
          ref: `tags/${tag}`
      });

      return data ? true : false;
  }
  catch (e) {
    if (e.status === 404) return false;
    throw new Error(`Retrieving refs failed with the following error: ${e}`)
  }
}

// Concept taken from https://github.com/actions/publish-action
async function createRefOnGitHub(octokit, tag, upsert = false) {
  core.info(`Generating the ref [${tag}] on GitHub...`);

  const sha =
    github.context.eventName === 'pull_request'
      ? github.context.payload.pull_request.head.sha
      : github.context.sha;

  const foundTag = await tagExists(octokit, tag);
  if (!upsert && foundTag) throw new Error('Reference tag already exists');

  const payload = {
    ...context.repo,
    sha
  };

  if (foundTag) {
    await octokit.rest.git.updateRef({
        ...payload,
        ref: `tags/${tag}`,
        force: true
      });

      core.info('Finished updating the ref on GitHub.');
      return;
  }

  await octokit.rest.git.createRef({
      ...payload,
      ref: `refs/tags/${tag}`
    });

  core.info('Finished creating the ref on GitHub.');
}
