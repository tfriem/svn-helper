# svn-helper

[![npm version](https://badge.fury.io/js/svn-helper.svg)](https://badge.fury.io/js/svn-helper)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/tfriem/svn-helper.svg?branch=master)](https://travis-ci.org/tfriem/svn-helper)
[![CircleCI](https://circleci.com/gh/tfriem/svn-helper.svg?style=svg)](https://circleci.com/gh/tfriem/svn-helper)
[![Maintainability](https://api.codeclimate.com/v1/badges/cbea87bd571387a1a3af/maintainability)](https://codeclimate.com/github/tfriem/svn-helper/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/tfriem/svn-helper/badge.svg?branch=master)](https://coveralls.io/github/tfriem/svn-helper?branch=master)
[![codecov](https://codecov.io/gh/tfriem/svn-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/tfriem/svn-helper)

_svn-helper_ is a command line tool that aims to improve working with multiple subversion repositories at specific versions. For this it provides commands to switch multiple working copies at once.

## Usage

### Commands

  <!-- commands -->
* [`svn-helper help [COMMAND]`](#svn-helper-help-command)
* [`svn-helper merge [PATH]`](#svn-helper-merge-path)
* [`svn-helper switch [PATH]`](#svn-helper-switch-path)
* [`svn-helper switch-release`](#svn-helper-switch-release)
* [`svn-helper switch-subsystem [SUBSYSTEM]`](#svn-helper-switch-subsystem-subsystem)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src\commands\help.ts)_

## `svn-helper merge [PATH]`

merge from another version

```
USAGE
  $ svn-helper merge [PATH]

OPTIONS
  -b, --branch=(trunk|branches|tags)  branch type
  -h, --help                          show CLI help
  -q, --quiet                         supress svn output
  -v, --version=version               version

ALIASES
  $ svn-helper m

EXAMPLES
  $ svn-helper merge -b trunk
  $ svn-helper merge -b branches -v 1.2.3
```

_See code: [src\commands\merge.ts](https://github.com/tfriem/svn-helper/blob/v1.1.1/src\commands\merge.ts)_

## `svn-helper switch [PATH]`

switch repository to a different version

```
USAGE
  $ svn-helper switch [PATH]

OPTIONS
  -b, --branch=(trunk|branches|tags)  branch type
  -h, --help                          show CLI help
  -q, --quiet                         supress svn output
  -v, --version=version               version

ALIASES
  $ svn-helper sw

EXAMPLES
  $ svn-helper switch -b trunk
  $ svn-helper switch -b branches -v 1.2.3
```

_See code: [src\commands\switch.ts](https://github.com/tfriem/svn-helper/blob/v1.1.1/src\commands\switch.ts)_

## `svn-helper switch-release`

switch repositories to configured release versions

```
USAGE
  $ svn-helper switch-release

OPTIONS
  -h, --help             show CLI help
  -q, --quiet            supress svn output
  -r, --release=release  release name

ALIASES
  $ svn-helper swr

EXAMPLE
  $ svn-helper switch-release -r 1.2
```

_See code: [src\commands\switch-release.ts](https://github.com/tfriem/svn-helper/blob/v1.1.1/src\commands\switch-release.ts)_

## `svn-helper switch-subsystem [SUBSYSTEM]`

switch repositories for a configured subsystem to a different version

```
USAGE
  $ svn-helper switch-subsystem [SUBSYSTEM]

OPTIONS
  -b, --branch=(trunk|branches|tags)  branch type
  -h, --help                          show CLI help
  -q, --quiet                         supress svn output
  -v, --version=version               version

ALIASES
  $ svn-helper sws

EXAMPLES
  $ svn-helper switch-subsystem -b trunk subsystem1
  $ svn-helper switch-subsystem -b branches -v 1.2.3 subsystem1
```

_See code: [src\commands\switch-subsystem.ts](https://github.com/tfriem/svn-helper/blob/v1.1.1/src\commands\switch-subsystem.ts)_
<!-- commandsstop -->

## Config example

**.svnhelper.conf**

```json
{
  "releases": [
    {
      "name": "TestRelease",
      "versions": [
        {"name": "branches/1.0", "projects": ["proj1", "proj3"]},
        {"name": "branches/1.2.3", "projects": ["proj2", "proj4", "proj5"]}
      ]
    },
    {
      "name": "TestRelease2",
      "versions": [
        {"name": "branches/1.2.3", "projects": ["proj1", "proj3"]},
        {"name": "branches/1.2.3", "projects": ["proj2", "proj4"]}
      ]
    }
  ],
  "subsystems": [
    {
      "name": "core",
      "projects": ["proj1"]
    },
    {
      "name": "pluginA",
      "projects": ["proj2"]
    },
    {
      "name": "SystemX",
      "projects": ["proj3", "proj4"]
    }
  ]
}
```

## Caveats

It is assumed that the subversion repositories adhere to the recommend directory structure using trunk, branches/{version} and tags/{version}.
