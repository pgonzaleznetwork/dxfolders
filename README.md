# dxfolders

[![NPM](https://img.shields.io/npm/v/dxfolders.svg?label=dxfolders)](https://www.npmjs.com/package/dxfolders) [![Downloads/week](https://img.shields.io/npm/dw/dxfolders.svg)](https://npmjs.org/package/dxfolders) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/dxfolders/main/LICENSE.txt)

## Commands

<!-- commands -->

- [`sf call external service`](#sf-call-external-service)
- [`sf connect org`](#sf-connect-org)
- [`sf dxdir arrange`](#sf-dxdir-arrange)
- [`sf dxdir reset`](#sf-dxdir-reset)
- [`sf dxdir showme`](#sf-dxdir-showme)
- [`sf hello world`](#sf-hello-world)

## `sf call external service`

Summary of a command.

```
USAGE
  $ sf call external service [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  Description of a command.

EXAMPLES
  $ sf call external service
```

## `sf connect org`

Summary of a command.

```
USAGE
  $ sf connect org -u <value> [--json]

FLAGS
  -u, --username=<value>  (required) Salesforce org username.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  Description of a command.

EXAMPLES
  $ sf connect org
```

## `sf dxdir arrange`

Summary of a command.

```
USAGE
  $ sf dxdir arrange [--json] [-d <value>]

FLAGS
  -d, --apex-dir=<value>  [default: force-app/main/default/classes] The directory where your apex class files are
                          located.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  Description of a command.

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

## `sf dxdir showme`

Summary of a command.

```
USAGE
  $ sf dxdir showme [--json] [-n <value>]

FLAGS
  -n, --name=<value>  Description of a flag.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Summary of a command.

  Description of a command.

EXAMPLES
  $ sf dxdir showme
```

## `sf hello world`

Say hello.

```
USAGE
  $ sf hello world [--json] [-n <value>]

FLAGS
  -n, --name=<value>  [default: World] The name of the person you'd like to say hello to.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Say hello.

  Say hello either to the world or someone you know.

EXAMPLES
  Say hello to the world:

    $ sf hello world

  Say hello to someone you know:

    $ sf hello world --name Astro
```

<!-- commandsstop -->
