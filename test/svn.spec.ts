import * as execa from 'execa'

import {BranchType, getVersionFromWorkingCopy} from '../src/svn'

import {mocked} from './helper'

jest.mock('execa')

const testData = [
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

describe('svn', () => {
  describe('#getVersionFromWorkingCopy', () => {
    testData.forEach(data => {
      test(`Parse URL "${data.url}" correctly`, async () => {
        mocked(execa.shell).mockResolvedValue({
          stdout: data.url
        })
        const version = await getVersionFromWorkingCopy('dummy')
        expect(version).toEqual(data.result)
      })
    })
  })
})
