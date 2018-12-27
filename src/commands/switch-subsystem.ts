import {Command, flags} from '@oclif/command'
import * as Listr from 'listr'

import {
  ask,
  askForBranch,
  askForVersion,
  getSvnBranchTypeFromString,
  getSvnVersionFromStrings,
  svnVersionAsString,
  versionRequired
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
      description: 'branch type'
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

    let subsystemName = args.subsystem
    let branch = flags.branch
    let version = flags.version

    const userConfig = await readConfig()

    if (!subsystemName) {
      const subsystems = userConfig.subsystems.map(subsystem => subsystem.name)
      subsystemName = await ask('Subsystem', subsystems)
    }

    const subsystem = userConfig.subsystems.find(
      subsystem => subsystem.name === subsystemName
    )

    if (!subsystem) {
      this.error(`Subsystem "${subsystemName}" not found in configuration`)
      return
    }

    if (!branch) {
      branch = await askForBranch()
    }

    const branchType = getSvnBranchTypeFromString(branch)

    if (versionRequired(branchType) && !version) {
      const firstProject = subsystem.projects[0]
      if (firstProject) {
        version = await askForVersion(firstProject, branchType)
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
}
