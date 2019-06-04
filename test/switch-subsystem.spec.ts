import * as commandUtils from '../src/command-utils'
import SwitchSubsystem from '../src/commands/switch-subsystem'
import * as config from '../src/config'
import * as svn from '../src/svn'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Commands', () => {
  describe('switch', () => {
    test('Switch to trunk', async () => {
      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue({ type: svn.BranchType.BRANCH, version: '1.0.x' })

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchSubsystem.run(['-b', 'trunk', 'core'])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual(svn.SvnVersion.Trunk)
    })
    test('Skip switch to trunk if already trunk', async () => {
      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue(svn.SvnVersion.Trunk)

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchSubsystem.run(['-b', 'trunk', 'core'])

      expect(switchToVersionMock).not.toBeCalled()
    })
    test('Switch to trunk after asking for branch', async () => {
      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('trunk')

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue({ type: svn.BranchType.BRANCH, version: '1.0.x' })

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchSubsystem.run(['core'])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual(svn.SvnVersion.Trunk)
    })
    test('Switch to branch 1.2.3 after asking for subsystem, branch and version', async () => {
      const targetVersion = '1.2.3'

      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('branches')
      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)
      jest.spyOn(commandUtils, 'ask').mockResolvedValue('core')

      jest.spyOn(svn, 'getVersionFromWorkingCopy').mockResolvedValue({
        type: svn.BranchType.TAG,
        version: targetVersion
      })

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchSubsystem.run([])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Switch to branch 1.2.3 after asking for version', async () => {
      const targetVersion = '1.2.3'

      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)

      jest
        .spyOn(svn, 'getVersionFromWorkingCopy')
        .mockResolvedValue(svn.SvnVersion.Trunk)

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await SwitchSubsystem.run(['-b', 'branches', 'core'])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Unknown subsystem', async () => {
      jest
        .spyOn(config, 'readConfig')
        .mockResolvedValue({ subsystems: [{ name: 'core', projects: ['proj1'] }], releases: [] })

      await expect(
        SwitchSubsystem.run(['-b', 'branches', 'UnknownSubsystem'])
      ).rejects.toThrow()
    })
  })
})
