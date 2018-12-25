svn-helper
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/svn-helper.svg)](https://npmjs.org/package/svn-helper)
[![Downloads/week](https://img.shields.io/npm/dw/svn-helper.svg)](https://npmjs.org/package/svn-helper)
[![License](https://img.shields.io/npm/l/svn-helper.svg)](https://github.com/tfriem/svn-helper/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g svn-helper
$ svn-helper COMMAND
running command...
$ svn-helper (-v|--version|version)
svn-helper/0.1.0 darwin-x64 node-v11.4.0
$ svn-helper --help [COMMAND]
USAGE
  $ svn-helper COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`svn-helper hello [FILE]`](#svn-helper-hello-file)
* [`svn-helper help [COMMAND]`](#svn-helper-help-command)

## `svn-helper hello [FILE]`

describe the command here

```
USAGE
  $ svn-helper hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ svn-helper hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/tfriem/svn-helper/blob/v0.1.0/src/commands/hello.ts)_

## `svn-helper help [COMMAND]`

display help for svn-helper

```
USAGE
  $ svn-helper help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->
