import {Command, flags} from '@oclif/command'

import {
  askForBranch,
  askForVersion,
  getSvnBranchTypeFromString,
  versionRequired
} from '../command-utils'
import {branchFlag, quietFlag, versionFlag} from '../flags'
import {mergeFromVersion, SvnVersion} from '../svn'

export default class Merge extends Command {
  static description = 'merge from another version'

  static aliases = ['m']

  static flags = {
    branch: branchFlag,
    version: versionFlag,
    quiet: quietFlag,
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'path', default: '.'}]

  static examples = [
    '$ svn-helper merge -b trunk',
    '$ svn-helper merge -b branches -v 1.2.3'
  ]

  async run() {
    const {args, flags} = this.parse(Merge)

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

    const output = await mergeFromVersion(
      path,
      new SvnVersion(branchType, version)
    )
    if (!flags.quiet) {
      this.log(output)
    }
  }
}
