import {Command, flags} from '@oclif/command'
import * as Listr from 'listr'

import {
  askForVersion,
  getSvnVersionFromStrings,
  svnVersionAsString
} from '../command-utils'
import {readConfig} from '../config'
import {switchToVersion} from '../svn'

export default class SwitchSubsystem extends Command {
  static description =
    'switch repositories for a configured subsystem to a different version'

  static aliases = ['sws']

  static flags = {
    branch: flags.enum({
      char: 'b',
      options: ['trunk', 'branches', 'tags'],
      description: 'branch type',
      required: true
    }),
    version: flags.string({char: 'v', description: 'version'}),
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'subsystem'}]

  static examples = [
    '$ svn-helper switch-subsystem -b trunk subsystem1',
    '$ svn-helper switch-subsystem -b branches -v 1.2.3 subsystem1'
  ]

  async run() {
    const {args, flags} = this.parse(SwitchSubsystem)

    const subsystemName = args.subsystem
    const branch = flags.branch
    let version = flags.version

    const userConfig = await readConfig()

    const subsystem = userConfig.subsystems.find(
      subsystem => subsystem.name === subsystemName
    )

    if (!subsystem) {
      this.error(`Subsystem "${subsystemName}" not found in configuration`)
      return
    }

    if (this.versionRequired(branch) && !version) {
      const firstProject = subsystem.projects[0]
      if (firstProject) {
        version = await askForVersion(firstProject)
      }
    }

    const tasks = subsystem.projects.map(project => {
      const targetVersion = getSvnVersionFromStrings(branch, version)
      return {
        title: `Switch ${project} to ${svnVersionAsString(targetVersion)}`,
        task: () => switchToVersion(project, targetVersion)
      }
    })

    new Listr(tasks, {concurrent: true, exitOnError: false})
      .run()
      .catch(this.error)
  }

  private versionRequired(branch: string): boolean {
    return branch === 'branches' || branch === 'tags'
  }
}
