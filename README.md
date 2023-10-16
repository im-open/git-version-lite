# Tests

Force tests to run from a fork to see what happens

# git-version-lite

This template can be used to calculate a release or pre-release version.  

## Index <!-- omit in toc -->

- [git-version-lite](#git-version-lite)
  - [Pre-requisites](#pre-requisites)
  - [Release vs Pre-release](#release-vs-pre-release)
  - [Incrementing Strategy](#incrementing-strategy)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Breaking Changes](#breaking-changes)
    - [v2 to v3](#v2-to-v3)
  - [Usage Examples](#usage-examples)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Recompiling Manually](#recompiling-manually)
    - [Updating the README.md](#updating-the-readmemd)
    - [Tests](#tests)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Pre-requisites

This action relies on git history in order to determine the next version.  This means the `actions-checkout` step should be added before this action and a `fetch-depth: 0` needs to be set as an argument in order to fetch all history for branches and tags.  If `fetch-depth: 0` is not set, the action will have no tags to compare and returns `1.0.0` as the next version.

## Release vs Pre-release

You can control whether the action will generate a release or pre-release next version with the `calculate-prerelease-version` flag.  The pre-release versions are intended for use with branches and a branch name is required to generate one.  

- Release version format: `major.minor.patch` (`1.0.0`)
- Pre-release version format: `major.minor.patch-<cleaned-branch-name>.<formated-date>` (`0.1.0-my-branch.210907164247`)
  - The action will clean the provided branch name.  It only accepts `a-z, A-Z, 0-9` and `-`, any other character will be replaced with `-`.
  - If the branch name includes `refs/heads/` that will be removed as well.

## Incrementing Strategy

If a previous release (tag) is found, the action examines the commit messages to determine whether the next version should be a major, minor or patch increment.
For pre-release versions the commits on the current branch are used, and for release versions the commits between the last tag and HEAD are used.

The action will increment the major version if it identifies any of the following patterns in the commit body or notes:
| Pattern                            | Examples                           |
|------------------------------------|------------------------------------|
| `/\+semver:\s*(breaking\|major)/i` | +semver:breaking, +semver:major    |
| `/BREAKING CHANGES?:?/`            | BREAKING CHANGE:, BREAKING CHANGES |

The action will increment the minor version if it identifies any of the following patterns in the commit body or notes:
| Pattern                           | Examples                                          |
|-----------------------------------|---------------------------------------------------|
| `/\+semver:\s*(feature\|minor)/i` | +semver:feature, +semver:minor                    |
| `/feat\([^)]*\):\s/`              | feat(area): something, feat(): something          |
| `/feature\([^)]*\):\s/`           | feature(area): something, feature(): something    |
| `/^feat:\s.+/m`                   | feat: something (*at the beginning of a line*)    |
| `/^feature:\s.+/m`                | feature: something (*at the beginning of a line*) |

If none of the previous patterns match, the action will increment the patch version.

## Inputs

| Parameter                      | Is Required                                            | Default | Description                                                                                                                                                                                                                                                                                                |
|--------------------------------|--------------------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tag-prefix`                   | false                                                  | `v`     | By default the action strips the prefixes off, but any value provided here will be prepended to the next calculated version.<br/><br/>GitHub indicates it is common practice to prefix your version names with the letter `v` (which is the default).  If you do not want a prefix use `tag-prefix: none`. |
| `fallback-to-no-prefix-search` | false                                                  | `true`  | Flag indicating whether it should fallback to a prefix-less search if no tags are found with the current prefix.  Helpful when starting to use prefixes with tags.  Accepted values: true\|false.                                                                                                          |
| `calculate-prerelease-version` | false                                                  | `false` | Flag indicating whether to calculate a pre-release version rather than a release version.  Accepts: `true\|false`.                                                                                                                                                                                         |
| `branch-name`                  | Required when<br/>`calculate-prerelease-version: true` | N/A     | The name of the branch the next pre-release version is being generated for. Required when calculating the pre-release version.                                                                                                                                                                             |
| `default-release-type`         | false                                                  | `major` | The default release type that should be used when no tags are detected.  Defaults to major.  Accepted values: `major\|minor\|patch`.                                                                                                                                                                       |

## Outputs

Each of the outputs are available as environment variables and as action outputs.

| Output                         | Description                                                     |
|--------------------------------|-----------------------------------------------------------------|
| `NEXT_VERSION`                 | The next `major.minor.patch` version                            |
| `NEXT_VERSION_NO_PREFIX`       | The next `major.minor.patch` version without the tag prefix     |
| `NEXT_MINOR_VERSION`           | The next `major.minor` version                                  |
| `NEXT_MINOR_VERSION_NO_PREFIX` | The next `major.minor` version without the tag prefix           |
| `NEXT_MAJOR_VERSION`           | The next `major` version                                        |
| `NEXT_MAJOR_VERSION_NO_PREFIX` | The next `major` version without the tag prefix                 |
| `NEXT_VERSION_SHA`             | The SHA of the next version as an environment variable          |
| `PRIOR_VERSION`                | The previous `major.minor.patch` version                        |
| `PRIOR_VERSION_NO_PREFIX`      | The previous `major.minor.patch` version without the tag prefix |

## Breaking Changes

### v2 to v3

- The `create-ref` input was removed
  - This input has been deprecated for a while.  We recommend replacing this functionality with the `[im-open/create-release]` action.
- The `github-token` input was removed
  - This was only needed to create a ref on the repository so it is no longer needed.
- The `NEXT_VERSION_SHA` output was removed
  - Workflows can use the value that git-version-lite outputted directly.  
  - For `pull_request` workflow triggers the value was `github.event.pull_request.head.sha`.  
  - For all other workflow triggers the value was `github.sha`

## Usage Examples

```yml
on:
  pull_request: 

jobs:
  get-prerelease-version:
    runs-on: ubuntu-20.04

    outputs:
      NEXT_VERSION: ${{ steps.get-version.outputs.NEXT_VERSION }}

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0                        # Includes all history for all branches and tags

      - id: get-version
        # You may also reference just the major version.
        uses: im-open/git-version-lite@v3.0.0
        with:
          calculate-prerelease-version: true
          branch-name: ${{ github.head_ref }}       # github.head_ref works when the trigger is pull_request
          tag-prefix: v                             # Prepend a v to any calculated release/pre-release version
          fallback-to-no-prefix-search: true        # Set to true can be helpful when starting to add tag prefixes
          default-release-type: major               # If no tags are found, default to doing a major increment
          
      - run: |
          echo "The next version is ${{ env.NEXT_VERSION }}"
          echo "The next version without the prefix is ${{ steps.get-version.outputs.NEXT_VERSION_NO_PREFIX }}"

```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.
- [ ] Any tests in the [build-and-review-pr] workflow are passing

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

### Tests

The build and review PR workflow includes tests which are linked to a status check. That status check needs to succeed before a PR is merged to the default branch.  When a PR comes from a branch, there should not be any issues running the tests. When a PR comes from a fork, tests may not have the required permissions or access to run since the `GITHUB_TOKEN` only has `read` access set for all scopes. Also, forks cannot access other secrets in the repository.  In these scenarios, a fork may need to be merged into an intermediate branch by the repository owners to ensure the tests run successfully prior to merging to the default branch.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2023, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
