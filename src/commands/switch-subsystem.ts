import {Command, flags} from '@oclif/command'

import {
  ask,
  askForBranch,
  askForVersion,
  createSwitchTask,
  getSvnBranchTypeFromString,
  runTasks,
  versionRequired
} from '../command-utils'
import {Config, readConfig} from '../config'
import {branchFlag, quietFlag, versionFlag} from '../flags'
import {SvnVersion} from '../svn'

export default class SwitchSubsystem extends Command {
  static description =
    'switch repositories for a configured subsystem to a different version'

  static aliases = ['sws']

  static flags = {
    branch: branchFlag,
    version: versionFlag,
    quiet: quietFlag,
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'subsystem'}]

  static examples = [
    '$ svn-helper switch-subsystem -b trunk subsystem1',
    '$ svn-helper switch-subsystem -b branches -v 1.2.3 subsystem1'
  ]

  async run() {
    const {args, flags} = this.parse(SwitchSubsystem)

    const quiet = flags.quiet

    const subsystemName = args.subsystem
    const branchName = flags.branch
    const versionName = flags.version

    const userConfig = await readConfig()

    const subsystem = await this.handleSubsystem(subsystemName, userConfig)

    if (!subsystem) {
      this.error(`Subsystem "${subsystemName}" not found in configuration`)
      return
    }

    const targetVersion = await this.handleBranchAndVersion(
      branchName,
      versionName,
      subsystem.projects[0]
    )

    const tasks = subsystem.projects.map(project =>
      createSwitchTask(project, targetVersion)
    )

    await runTasks(tasks, quiet)
  }

  private async handleSubsystem(subsystemName: string, userConfig: Config) {
    if (!subsystemName) {
      const subsystems = userConfig.subsystems.map(subsystem => subsystem.name)
      subsystemName = await ask('Subsystem', subsystems)
    }

    return userConfig.subsystems.find(
      subsystem => subsystem.name === subsystemName
    )
  }

  private async handleBranchAndVersion(
    branch: string,
    version: string | undefined,
    referenceProject: string
  ) {
    if (!branch) {
      branch = await askForBranch()
    }

    const branchType = getSvnBranchTypeFromString(branch)

    if (versionRequired(branchType) && !version) {
      const firstProject = referenceProject
      if (firstProject) {
        version = await askForVersion(firstProject, branchType)
      }
    }

    return new SvnVersion(branchType, version)
  }
}
