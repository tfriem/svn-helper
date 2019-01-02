import * as execa from 'execa'

import {
  getBranchVersions,
  getTagVersions,
  getVersionFromWorkingCopy,
  switchToVersion
} from '../src/svn'

import {mocked} from './helper'
import {
  getVersionFromWorkingCopyTestData,
  getVersionsTestData,
  switchToVersionTestData
} from './svn.fixtures'

jest.mock('execa')

beforeEach(() => {
  mocked(execa.shell).mockReset()
})

describe('svn', () => {
  describe('#getVersionFromWorkingCopy', () => {
    getVersionFromWorkingCopyTestData.forEach(data => {
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
    switchToVersionTestData.forEach(data => {
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
  describe('#getTagVersions', () => {
    getVersionsTestData.forEach(data => {
      test(`Get versions from [${data.ls}]`, async () => {
        mocked(execa.shell)
          .mockResolvedValueOnce({
            stdout: 'https://host:1234/repos/repo1/branches/1.0.x/'
          })
          .mockResolvedValueOnce({stdout: data.ls})
        const versions = await getTagVersions('dummy')
        expect(versions).toEqual(data.result)
      })
    })
  })
  describe('#getBranchVersions', () => {
    getVersionsTestData.forEach(data => {
      test(`Get versions from [${data.ls}]`, async () => {
        mocked(execa.shell)
          .mockResolvedValueOnce({
            stdout: 'https://host:1234/repos/repo1/tags/1.0.x/'
          })
          .mockResolvedValueOnce({stdout: data.ls})
        const versions = await getBranchVersions('dummy')
        expect(versions).toEqual(data.result)
      })
    })
  })
})
