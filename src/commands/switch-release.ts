import {Command, flags} from '@oclif/command'
import * as Listr from 'listr'
import * as _ from 'lodash'

import {
  ask,
  getSvnVersionFromConfig,
  svnVersionAsString
} from '../command-utils'
import {readConfig} from '../config'
import {switchToVersion} from '../svn'

export default class SwitchRelease extends Command {
  static description = 'switch repositories to configured release versions'

  static aliases = ['swr']

  static flags = {
    release: flags.string({
      char: 'r',
      description: 'release name'
    }),
    help: flags.help({char: 'h'})
  }

  static examples = ['$ svn-helper switch-release -r 1.2']

  async run() {
    const {flags} = this.parse(SwitchRelease)

    const userConfig = await readConfig()

    let releaseName = flags.release

    if (!releaseName) {
      const releases = userConfig.releases.map(release => release.name)
      releaseName = await ask('Release', releases)
    }

    const release = userConfig.releases.find(
      release => release.name === releaseName
    )

    if (!release) {
      this.error(`Release "${flags.release}" not found in configuration`)
      return
    }

    const tasks = _.chain(release.versions)
      .flatMap(version =>
        version.projects.map(project => {
          const targetVersion = getSvnVersionFromConfig(version.name)
          return {
            title: `Switch ${project} to ${svnVersionAsString(targetVersion)}`,
            task: () => switchToVersion(project, targetVersion)
          }
        })
      )
      .value()

    new Listr(tasks, {concurrent: true, exitOnError: false})
      .run()
      .catch(this.error)
  }
}
