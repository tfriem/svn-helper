import * as commandUtils from '../src/command-utils'
import Switch from '../src/commands/switch'
import * as svn from '../src/svn'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Commands', () => {
  describe('switch', () => {
    test('Switch to trunk', async () => {
      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run(['-b', 'trunk'])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual(svn.Trunk)
    })
    test('Switch to trunk after asking for branch', async () => {
      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('trunk')

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run([])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual(svn.Trunk)
    })
    test('Switch to branch 1.0.x', async () => {
      const targetVersion = '1.0.x'
      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run(['-b', 'branches', '-v', targetVersion])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Switch to branch 1.0.x after asking for branch and version', async () => {
      const targetVersion = '1.0.x'

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('branches')
      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run([])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Switch to tag 1.2.3', async () => {
      const targetVersion = '1.2.3'
      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run(['-b', 'tags', '-v', targetVersion])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.TAG,
        version: targetVersion
      })
    })
    test('Switch to tag 1.2.3 after asking for branch and version', async () => {
      const targetVersion = '1.0.x'

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('tags')
      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)

      const switchToVersionMock = jest
        .spyOn(svn, 'switchToVersion')
        .mockResolvedValue('Output')

      await Switch.run([])

      expect(switchToVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.TAG,
        version: targetVersion
      })
    })
  })
})
