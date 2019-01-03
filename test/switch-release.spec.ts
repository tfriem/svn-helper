import * as commandUtils from '../src/command-utils'
import SwitchRelease from '../src/commands/switch-release'
import * as config from '../src/config'
import * as svn from '../src/svn'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Commands', () => {
  describe('switch', () => {
    test('Ask for release', async () => {
      jest.spyOn(config, 'readConfig').mockResolvedValue({
        releases: [
          {
            name: 'AllTrunk',
            versions: [{name: 'trunk', projects: ['proj1', 'proj2']}]
          }
        ]
      })

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue({type: svn.BranchType.BRANCH, version: '1.0.x'})

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      const askMock = jest
        .spyOn(commandUtils, 'ask')
        .mockResolvedValue('AllTrunk')

      await SwitchRelease.run([])

      expect(askMock).toBeCalled()
      expect(switchToVersionMock.mock.calls[0]).toEqual([
        'proj1',
        svn.SvnVersion.Trunk
      ])
    })
    test('Unknown release', async () => {
      jest.spyOn(config, 'readConfig').mockResolvedValue({
        releases: [
          {
            name: 'AllTrunk',
            versions: [{name: 'trunk', projects: ['proj1', 'proj2']}]
          }
        ]
      })

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue({type: svn.BranchType.BRANCH, version: '1.0.x'})

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      const askMock = jest
        .spyOn(commandUtils, 'ask')
        .mockResolvedValue('AllTrunk')

      await expect(
        SwitchRelease.run(['-r', 'NotConfiguredRelease'])
      ).rejects.toThrow()

      expect(askMock).not.toBeCalled()
      expect(switchToVersionMock).not.toBeCalled()
    })
    test('Switch multiple projects to trunk release', async () => {
      jest.spyOn(config, 'readConfig').mockResolvedValue({
        releases: [
          {
            name: 'AllTrunk',
            versions: [{name: 'trunk', projects: ['proj1', 'proj2']}]
          }
        ]
      })

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue({type: svn.BranchType.BRANCH, version: '1.0.x'})

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchRelease.run(['-r', 'AllTrunk'])

      expect(switchToVersionMock.mock.calls[0]).toEqual([
        'proj1',
        svn.SvnVersion.Trunk
      ])
      expect(switchToVersionMock.mock.calls[1]).toEqual([
        'proj2',
        svn.SvnVersion.Trunk
      ])
    })
  })
})
