import {BranchType, SvnVersion} from '../src/svn'

class SwitchToVersionTestType {
  constructor(
    readonly targetVersion: SvnVersion,
    readonly fromUrl: string,
    readonly toUrl: string
  ) {}
}

export const getVersionFromWorkingCopyTestData = [
  {
    url: 'https://host:1234/repos/repo1/trunk',
    result: {type: BranchType.TRUNK}
  },
  {
    url: 'https://host:1234/repos/repo1/trunk/',
    result: {type: BranchType.TRUNK}
  },
  {
    url: 'https://host:1234/repos/repo1/branches',
    result: {error: 'Could not parse version from URL'}
  },
  {
    url: 'https://host:1234/repos/repo1/branches/',
    result: {error: 'Could not parse version from URL'}
  },
  {
    url: 'https://host:1234/repos/repo1/branches/1.0.x',
    result: {type: BranchType.BRANCH, version: '1.0.x'}
  },
  {
    url: 'https://host:1234/repos/repo1/branches/1.0.x/',
    result: {type: BranchType.BRANCH, version: '1.0.x'}
  },
  {
    url: 'https://host:1234/repos/repo1/tags/1.0.x',
    result: {type: BranchType.TAG, version: '1.0.x'}
  },
  {
    url: 'https://host:1234/repos/repo1/tags/1.0.x/',
    result: {type: BranchType.TAG, version: '1.0.x'}
  }
]

export const switchToVersionTestData = [
  new SwitchToVersionTestType(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/1.0.x',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/1.0.x/',
    'https://host:1234/repos/repo1/trunk/'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk/',
    'https://host:1234/repos/repo1/branches/1.0.x/'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x/',
    'https://host:1234/repos/repo1/branches/1.0.x/'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk',
    'https://host:1234/repos/repo1/tags/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk/',
    'https://host:1234/repos/repo1/tags/1.0.x/'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches',
    'https://host:1234/repos/repo1/tags/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/',
    'https://host:1234/repos/repo1/tags/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x',
    'https://host:1234/repos/repo1/tags/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x/',
    'https://host:1234/repos/repo1/tags/1.0.x/'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/tags/2.0.x',
    'https://host:1234/repos/repo1/tags/1.0.x'
  ),
  new SwitchToVersionTestType(
    {type: BranchType.TAG, version: '1.0.x'},
    'https://host:1234/repos/repo1/tags/2.0.x/',
    'https://host:1234/repos/repo1/tags/1.0.x/'
  )
]

export const getVersionsTestData = [
  {ls: '', result: []},
  {ls: 'test', result: ['test']},
  {ls: ['test1', 'test2'].join('\n'), result: ['test1', 'test2']},
  {ls: ['test1/', 'test2'].join('\n'), result: ['test1', 'test2']},
  {ls: ['test1/', 'test2/'].join('\n'), result: ['test1', 'test2']}
]
