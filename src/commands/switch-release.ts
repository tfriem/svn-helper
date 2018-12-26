import {Command, flags} from '@oclif/command'
import {readJSON} from 'fs-extra'
import * as path from 'path'
import {switchToVersion, SvnVersion, BranchType} from '../svn'
import * as Listr from 'listr'
import * as _ from 'lodash'

export default class SwitchRelease extends Command {
  static description = 'switch repositories to configured release versions'

  static aliases = ['swr']

  static flags = {
    release: flags.string({
      char: 'r',
      required: true,
      description: 'release name'
    }),
    help: flags.help({char: 'h'})
  }

  static examples = ['$ svn-helper switch-release -r 1.2']

  async run() {
    const {flags} = this.parse(SwitchRelease)

    const userConfig: Config = await readJSON(
      path.join(this.config.configDir, 'config.json')
    )

    const release = userConfig.releases.find(
      release => release.name === flags.release
    )

    if (!release) {
      this.error(`Release "${flags.release}" not found in configuration`)
      return
    }

    const tasks = _.chain(release.versions)
      .flatMap(version =>
        version.projects.map(project => {
          const targetVersion = this.getSvnVersionFromConfig(version.name)
          return {
            title: `Switch ${project} to ${this.svnVersionAsString(
              targetVersion
            )}`,
            task: () => switchToVersion(project, targetVersion)
          }
        })
      )
      .value()

    new Listr(tasks, {concurrent: true, exitOnError: false})
      .run()
      .catch(this.error)
  }

  private getSvnVersionFromConfig(versionString: string): SvnVersion {
    const [branchType, version] = versionString.split('/')
    return this.getSvnVersionFromStrings(branchType, version)
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
}

interface ConfigVersion {
  name: string
  projects: Array<string>
}

interface ConfigRelease {
  name: string
  versions: Array<ConfigVersion>
}

interface Config {
  releases: Array<ConfigRelease>
}
