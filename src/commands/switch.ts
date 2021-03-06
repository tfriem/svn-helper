import {Command, flags} from '@oclif/command'

import {
  askForBranch,
  askForVersion,
  getSvnBranchTypeFromString,
  versionRequired
} from '../command-utils'
import {branchFlag, quietFlag, versionFlag} from '../flags'
import {SvnVersion, switchToVersion} from '../svn'

export default class Switch extends Command {
  static description = 'switch repository to a different version'

  static aliases = ['sw']

  static flags = {
    branch: branchFlag,
    version: versionFlag,
    quiet: quietFlag,
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'path', default: '.'}]

  static examples = [
    '$ svn-helper switch -b trunk',
    '$ svn-helper switch -b branches -v 1.2.3'
  ]

  async run() {
    const {args, flags} = this.parse(Switch)

    const path = args.path
    let branch = flags.branch
    let version = flags.version

    if (!branch) {
      branch = await askForBranch()
    }

    const branchType = getSvnBranchTypeFromString(branch)

    if (versionRequired(branchType) && !version) {
      version = await askForVersion(path, branchType)
    }

    const output = await switchToVersion(
      path,
      new SvnVersion(branchType, version)
    )
    if (!flags.quiet) {
      this.log(output)
    }
  }
}
