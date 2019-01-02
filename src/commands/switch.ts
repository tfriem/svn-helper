import {Command, flags} from '@oclif/command'

import {
  askForBranch,
  askForVersion,
  getSvnBranchTypeFromString,
  getSvnVersionFromStrings,
  versionRequired
} from '../command-utils'
import {branch, quiet, version} from '../flags'
import {switchToVersion} from '../svn'

export default class Switch extends Command {
  static description = 'switch repository to a different version'

  static aliases = ['sw']

  static flags = {
    branch: branch(),
    version: version(),
    quiet: quiet(),
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
      getSvnVersionFromStrings(branch, version)
    )
    if (!flags.quiet) {
      this.log(output)
    }
  }
}
