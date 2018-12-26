import {Command, flags} from '@oclif/command'
import {switchToVersion, SvnVersion, BranchType} from '../svn'
import {readJSON} from 'fs-extra'
import * as path from 'path'
import * as Listr from 'listr'
import * as _ from 'lodash'

export default class SwitchSubsystem extends Command {
  static description = 'describe the command here'

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

  static args = [{name: 'subsystem'}]

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
      const targetVersion = this.getSvnVersionFromStrings(
        flags.branch,
        flags.version
      )
      return {
        title: `Switch ${project} to ${this.svnVersionAsString(targetVersion)}`,
        task: () => switchToVersion(project, targetVersion)
      }
    })

    new Listr(tasks, {concurrent: true, exitOnError: false})
      .run()
      .catch(this.error)
  }

  private getSvnVersionFromStrings(
    branchType: string,
    version?: string
  ): SvnVersion {
    switch (branchType) {
      case 'trunk':
        return {type: BranchType.TRUNK}
      case 'branches':
        if (!version) {
          throw Error('No version provided')
        }
        return {type: BranchType.BRANCH, version}
      case 'tags':
        if (!version) {
          throw Error('No version provided')
        }
        return {type: BranchType.TAG, version}
      default:
        throw Error('Couldn not detect version')
    }
  }

  private svnVersionAsString(version: SvnVersion): string {
    let targetString
    switch (version.type) {
      case BranchType.TRUNK:
        targetString = 'trunk'
        break
      case BranchType.BRANCH:
        targetString = `branches/${version.version}`
        break
      case BranchType.TAG:
        targetString = `tags/${version.version}`
        break
      default:
        const _exhaustiveCheck: never = version
        targetString = 'ERROR'
    }
    return targetString
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
