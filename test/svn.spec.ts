import * as execa from 'execa'

import {
  BranchType,
  getVersionFromWorkingCopy,
  SvnVersion,
  switchToVersion
} from '../src/svn'

import {mocked} from './helper'

const getTestData = [
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

class SetTestData {
  constructor(
    readonly targetVersion: SvnVersion,
    readonly fromUrl: string,
    readonly toUrl: string
  ) {}
}

const setTestData = [
  new SetTestData(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/1.0.x',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SetTestData(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/1.0.x/',
    'https://host:1234/repos/repo1/trunk/'
  ),
  new SetTestData(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SetTestData(
    {type: BranchType.TRUNK},
    'https://host:1234/repos/repo1/branches/',
    'https://host:1234/repos/repo1/trunk'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/trunk/',
    'https://host:1234/repos/repo1/branches/1.0.x/'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x',
    'https://host:1234/repos/repo1/branches/1.0.x'
  ),
  new SetTestData(
    {type: BranchType.BRANCH, version: '1.0.x'},
    'https://host:1234/repos/repo1/branches/2.0.x/',
    'https://host:1234/repos/repo1/branches/1.0.x/'
  )
]

jest.mock('execa')

beforeEach(() => {
  mocked(execa.shell).mockReset()
})

describe('svn', () => {
  describe('#getVersionFromWorkingCopy', () => {
    getTestData.forEach(data => {
      test(`Parse URL "${data.url}" correctly`, async () => {
        mocked(execa.shell).mockResolvedValue({
          stdout: data.url
        })
        const version = await getVersionFromWorkingCopy('dummy')
        expect(version).toEqual(data.result)
      })
    })
  })
  describe('#switchToVersion', () => {
    setTestData.forEach(data => {
      test(`Switch from ${data.fromUrl} to ${data.toUrl}`, async () => {
        const path = 'dummy'
        mocked(execa.shell).mockResolvedValue({
          stdout: data.fromUrl
        })
        await switchToVersion(path, data.targetVersion)
        expect(mocked(execa.shell).mock.calls[1][0]).toBe(
          `svn switch ${data.toUrl} ${path}`
        )
      })
    })
  })
})
