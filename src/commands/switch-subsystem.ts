import {Command, flags} from '@oclif/command'
import {readJSON} from 'fs-extra'
import * as Listr from 'listr'
import * as path from 'path'

import {getSvnVersionFromStrings, svnVersionAsString} from '../command-utils'
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

    if (this.versionRequired(flags.branch) && !flags.version) {
      this.error(
        'A version is required when switching to a branch other than trunk'
      )
    }

    const userConfig: Config = await readJSON(
      path.join(this.config.configDir, 'config.json')
    )

    const subsystem = userConfig.subsystems.find(
      subsystem => subsystem.name === args.subsystem
    )

    if (!subsystem) {
      this.error(`Subsystem "${args.subsystem}" not found in configuration`)
      return
    }

    const tasks = subsystem.projects.map(project => {
      const targetVersion = getSvnVersionFromStrings(
        flags.branch,
        flags.version
      )
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

interface ConfigSubsystem {
  name: string
  projects: Array<string>
}

interface Config {
  subsystems: Array<ConfigSubsystem>
}
