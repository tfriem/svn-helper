import {Command, flags} from '@oclif/command'

import {askForVersion, getSvnVersionFromStrings} from '../command-utils'
import {switchToVersion} from '../svn'

export default class Switch extends Command {
  static description = 'switch repository to a different version'

  static aliases = ['sw']

  static flags = {
    branch: flags.enum({
      char: 'b',
      options: ['trunk', 'branches', 'tags'],
      description: 'branch type',
      required: true
    }),
    version: flags.string({char: 'v', description: 'version'}),
    quiet: flags.boolean({char: 'q', description: 'supress svn output'}),
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
    const branch = flags.branch
    let version = flags.version

    if (this.versionRequired(branch) && !version) {
      version = await askForVersion(path)
    }

    const output = await switchToVersion(
      path,
      getSvnVersionFromStrings(branch, version)
    )
    if (!flags.quiet) {
      this.log(output)
    }
  }

  private versionRequired(branch: string): boolean {
    return branch === 'branches' || branch === 'tags'
  }
}
