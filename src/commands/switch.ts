import {Command, flags} from '@oclif/command'

import {getSvnVersionFromStrings} from '../command-utils'
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

    if (this.versionRequired(flags.branch) && !flags.version) {
      this.error(
        'A version is required when switching to a branch other than trunk'
      )
    }

    const output = await switchToVersion(
      args.path,
      getSvnVersionFromStrings(flags.branch, flags.version)
    )
    if (!flags.quiet) {
      this.log(output)
    }
  }

  private versionRequired(branch: string): boolean {
    return branch === 'branches' || branch === 'tags'
  }
}
