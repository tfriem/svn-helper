import {
  getBranchVersions,
  getTagVersions,
  getVersionFromWorkingCopy,
  switchToVersion
} from '../src/svn'
import {svnInfoUrl, svnSwitch, svnLs} from '../src/svn/shell'

import {mocked, successfulShellReturn} from './helper'
import {
  getVersionFromWorkingCopyTestData,
  getVersionsTestData,
  switchToVersionTestData
} from './svn.fixtures'

jest.mock('../src/svn/shell')

beforeEach(() => {
  mocked(svnSwitch).mockReset()
})

describe('svn', () => {
  describe('#getVersionFromWorkingCopy', () => {
    getVersionFromWorkingCopyTestData.forEach(data => {
      test(`Parse URL "${data.url}" correctly`, async () => {
        const workingCopyPath = 'DoNotCare'
        mocked(svnInfoUrl).mockResolvedValue(successfulShellReturn(data.url))

        if (!data.result) {
          await expect(
            getVersionFromWorkingCopy(workingCopyPath)
          ).rejects.toThrow()
        } else {
          const version = await getVersionFromWorkingCopy(workingCopyPath)
          expect(version).toEqual(data.result)
        }
      })
    })
  })
  describe('#switchToVersion', () => {
    switchToVersionTestData.forEach(data => {
      test(`Switch from ${data.fromUrl} to ${data.toUrl}`, async () => {
        const workingCopyPath = 'DoNotCare'
        mocked(svnInfoUrl).mockResolvedValue(
          successfulShellReturn(data.fromUrl)
        )
        mocked(svnSwitch).mockResolvedValue(successfulShellReturn())

        await switchToVersion(workingCopyPath, data.targetVersion)

        expect(mocked(svnSwitch).mock.calls[0][1]).toBe(data.toUrl)
      })
    })
  })
  describe('#getTagVersions', () => {
    getVersionsTestData.forEach(data => {
      test(`Get versions from [${data.ls}]`, async () => {
        const workingCopyPath = 'DoNotCare'
        const workingCopyUrl = 'https://host:1234/repos/repo1/branches/1.0.x/'
        mocked(svnInfoUrl).mockResolvedValueOnce(
          successfulShellReturn(workingCopyUrl)
        )
        mocked(svnLs).mockResolvedValueOnce(successfulShellReturn(data.ls))

        const versions = await getTagVersions(workingCopyPath)

        expect(versions).toEqual(data.result)
      })
    })
  })
  describe('#getBranchVersions', () => {
    getVersionsTestData.forEach(data => {
      test(`Get versions from [${data.ls}]`, async () => {
        const workingCopyPath = 'DoNotCare'
        const workingCopyUrl = 'https://host:1234/repos/repo1/tags/1.0.x/'
        mocked(svnInfoUrl).mockResolvedValueOnce(
          successfulShellReturn(workingCopyUrl)
        )
        mocked(svnLs).mockResolvedValueOnce(successfulShellReturn(data.ls))

        const versions = await getBranchVersions(workingCopyPath)

        expect(versions).toEqual(data.result)
      })
    })
  })
})
