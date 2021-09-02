# git-version-lite

This template can be used to calculate a release or pre-release version.  

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
| `/\+semver:\s*(breaking\|major)/i` | +semver:breaking, +semver.major    |
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
    

## Inputs
| Parameter                      | Is Required                                           | Default | Description                                                                                                                         |
| ------------------------------ | ----------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `calculate-prerelease-version` | true                                                  | N/A     | Flag indicating whether to calculate a pre-release version rather than a release version.  Accepts: `true\|false`.                  |
| `branch-name`                  | Required when `calculate-prerelease-version` is true. | N/A     | The name of the branch the next version is being generated for. Required when calculating the pre-release version.                  |
| `tag-prefix`                   | false                                                 | N/A     | By default the action strips the prefixes off, but any value provided here will be pre-pended to the next calculated version.       |
| `default-release-type`         | false                                                 | `major` | The default release type that should be used when no tags are detected.  Defaults to major.  Accepted values: `major\|minor\|patch` |

## Outputs
| Output              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `env`.`VERSION`     | The calculated Version as an environment variable |
| `outputs`.`VERSION` | The calculated Version as an output               |

## Usage Examples

```yml
on:
  pull_request: 

jobs:
  get-prerelease-version:
    runs-on: ubuntu-20.04

    outputs:
      VERSION: ${{ steps.get-version.outputs.VERSION }}

    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0                        # Includes all history for all branches and tags

      - id: get-version
        uses: im-open/git-version-lite@v1.0.0
        with:
          calculate-prerelease-version: true
          branch-name: ${{ github.head_ref }}   # github.head_ref works when the trigger is pull_request
          tag-prefix: v                         # Prepend a v to any calculated release/pre-release version
          default-release-type: major           # If no tags are found, default to doing a major increment
      
      - run: echo "The next version is ${{ env.VERSION }}"

```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
