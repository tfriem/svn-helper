import * as commandUtils from '../src/command-utils'
import Merge from '../src/commands/merge'
import * as svn from '../src/svn'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Commands', () => {
  describe('switch', () => {
    test('Merge from trunk', async () => {
      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run(['-b', 'trunk'])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual(
        svn.SvnVersion.Trunk
      )
    })
    test('Merge from trunk after asking for branch', async () => {
      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('trunk')

      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run([])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual(
        svn.SvnVersion.Trunk
      )
    })
    test('Merge from branch 1.0.x', async () => {
      const targetVersion = '1.0.x'
      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run(['-b', 'branches', '-v', targetVersion])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Merge from branch 1.0.x after asking for branch and version', async () => {
      const targetVersion = '1.0.x'

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('branches')
      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)

      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run([])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.BRANCH,
        version: targetVersion
      })
    })
    test('Merge from tag 1.2.3', async () => {
      const targetVersion = '1.2.3'
      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run(['-b', 'tags', '-v', targetVersion])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.TAG,
        version: targetVersion
      })
    })
    test('Merge from tag 1.2.3 after asking for branch and version', async () => {
      const targetVersion = '1.0.x'

      jest.spyOn(commandUtils, 'askForBranch').mockResolvedValue('tags')
      jest.spyOn(commandUtils, 'askForVersion').mockResolvedValue(targetVersion)

      const mergeFromVersionMock = jest
        .spyOn(svn, 'mergeFromVersion')
        .mockResolvedValue('Output')

      await Merge.run([])

      expect(mergeFromVersionMock.mock.calls[0][1]).toEqual({
        type: svn.BranchType.TAG,
        version: targetVersion
      })
    })
  })
})
