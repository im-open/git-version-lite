# git-version-lite

This template can be used to calculate a release or pre-release version.  

## Index

- [Pre-requisites](#pre-requisites)
- [Release vs Pre-release](#release-vs-pre-release)
- [Incrementing Strategy](#incrementing-strategy)
- [Creating a Ref](#creating-a-ref)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
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
| ---------------------------------- | ---------------------------------- |
| `/\+semver:\s*(breaking\|major)/i` | +semver:breaking, +semver:major    |
| `/BREAKING CHANGES?:?/`            | BREAKING CHANGE:, BREAKING CHANGES |

The action will increment the minor version if it identifies any of the following patterns in the commit body or notes:
| Pattern                           | Examples                                          |
| --------------------------------- | ------------------------------------------------- |
| `/\+semver:\s*(feature\|minor)/i` | +semver:feature, +semver:minor                    |
| `/feat\([^)]*\):\s/`              | feat(area): something, feat(): something          |
| `/feature\([^)]*\):\s/`           | feature(area): something, feature(): something    |
| `/^feat:\s.+/m`                   | feat: something (*at the beginning of a line*)    |
| `/^feature:\s.+/m`                | feature: something (*at the beginning of a line*) |

If none of the previous patterns match, the action will increment the patch version.

## Creating a Ref
The action has a `create-ref` flag and when set to true it uses the GitHub rest API to [create a ref].  This API call results in a release and a tag being created.  This may be desirable in some workflows where you are incrementing on merge but may not work well for others like a CI build where you want to hold off pushing the ref until some steps have completed.

## Inputs
| Parameter                      | Is Required                                            | Default | Description                                                                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tag-prefix`                   | false                                                  | `v`     | By default the action strips the prefixes off, but any value provided here will be prepended to the next calculated version.<br/><br/>GitHub indicates it is common practice to prefix your version names with the letter `v` (which is the default).  If you do not want a prefix use `tag-prefix: none`. |
| `fallback-to-no-prefix-search` | false                                                  | `true`  | Flag indicating whether it should fallback to a prefix-less search if no tags are found with the current prefix.  Helpful when starting to use prefixes with tags.  Accepted values: true\|false.                                                                                                          |
| `calculate-prerelease-version` | false                                                  | `false` | Flag indicating whether to calculate a pre-release version rather than a release version.  Accepts: `true\|false`.                                                                                                                                                                                         |
| `branch-name`                  | Required when<br/>`calculate-prerelease-version: true` | N/A     | The name of the branch the next pre-release version is being generated for. Required when calculating the pre-release version.                                                                                                                                                                             |
| `create-ref`                   | false                                                  | `false` | Flag indicating whether the action should [create a ref] (a release and tag) on the repository.    Accepted values: `true\|false`.                                                                                                                                                                         |
| `github-token`                 | Required when<br/>`create-ref: true`                   | N/A     | Token with permissions to create a ref on the repository.                                                                                                                                                                                                                                                  |
| `default-release-type`         | false                                                  | `major` | The default release type that should be used when no tags are detected.  Defaults to major.  Accepted values: `major\|minor\|patch`.                                                                                                                                                                       |

## Outputs
| Output                   | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `env`.`NEXT_VERSION`     | The calculated Version as an environment variable |
| `outputs`.`NEXT_VERSION` | The calculated Version as an output               |

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
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0                        # Includes all history for all branches and tags

      - id: get-version
        uses: im-open/git-version-lite@v2.0.8
        with:
          calculate-prerelease-version: true
          branch-name: ${{ github.head_ref }}       # github.head_ref works when the trigger is pull_request
          tag-prefix: v                             # Prepend a v to any calculated release/pre-release version
          fallback-to-no-prefix-search: true        # Set to true can be helpful when starting to add tag prefixes
          default-release-type: major               # If no tags are found, default to doing a major increment
          create-ref: true                          # Will create a release/tag on the repo
          github-token: ${{ secrets.GITHUB_TOKEN }} # Required when creating a ref
      
      - run: echo "The next version is ${{ env.NEXT_VERSION }}"

```

## Contributing

When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
[create a ref]: https://docs.github.com/en/rest/reference/git#create-a-reference
