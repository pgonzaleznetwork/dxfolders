# dxfolders

[![NPM](https://img.shields.io/npm/v/dxfolders.svg?label=dxfolders)](https://www.npmjs.com/package/dxfolders) [![Downloads/week](https://img.shields.io/npm/dw/dxfolders.svg)](https://npmjs.org/package/dxfolders) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/dxfolders/main/LICENSE.txt)

## Commands

<!-- commands -->

- [`sf dxdir arrange`](#sf-dxdir-arrange)
- [`sf dxdir reset`](#sf-dxdir-reset)

## `sf dxdir arrange`

Arranges your apex classes based on their prefix

```
USAGE
  $ sf dxdir arrange [--json] [-d <value>]

FLAGS
  -d, --apex-dir=<value>  [default: force-app/main/default/classes] The directory where your apex class files are
                          located.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Arranges your apex classes based on their prefix

  This command goes through all apex class files on a given location and reorganises them based on their prefix (if
  any).

  For example, if you have the following classes:

  - `SRM_Deployer.cls`
  - `SRM_DeployerTests.cls`
  - `Account_Service.cls`
  - `Account_ServiceTests.cls`

  You will end up with the following folders

  - SRM
  - src
  - tests
  - Account
  - src
  - tests

  And the classes will be moved to those folders, taking into account whether they are tests classes.

EXAMPLES
  $ sf dxdir arrange
```

## `sf dxdir reset`

Summary of a command.

```
USAGE
  $ sf dxdir reset -o <value> -d <value> [--json]

FLAGS
  -d, --apex-dir=<value>    (required) [default: force-app/main/default/classes] The location of the apex folders and
                            subfolders.
  -o, --output-dir=<value>  (required) [default: force-app/main/default/classes] The location of the flattened apex
                            files.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  Description of a command.

EXAMPLES
  $ sf dxdir reset
```

<!-- commandsstop -->
