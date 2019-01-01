# svn-helper

_svn-helper_ is a command line tool that aims to improve working with multiple subversion repositories at specific versions. For this it provides commands to switch multiple working copies at once.

## Usage

### Commands

```
USAGE
  $ svn-helper [COMMAND]

COMMANDS
  help              display help for svn-helper
  switch            switch repository to a different version
  switch-release    switch repositories to configured release versions
  switch-subsystem  switch repositories for a configured subsystem to a different version
```

### Switch

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

### Switch-Release

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

### Switch-Subsystem

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
