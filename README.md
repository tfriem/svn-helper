# svn-helper

WIP

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
      "name": "main",
      "projects": ["proj1"]
    },
    {
      "name": "base",
      "projects": ["proj2"]
    },
    {
      "name": "cctv",
      "projects": ["proj3", "proj4"]
    }
  ]
}
```
