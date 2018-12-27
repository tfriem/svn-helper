import {Command, flags} from '@oclif/command'
import * as _ from 'lodash'

import {
  ask,
  createSwitchTask,
  getSvnVersionFromConfig,
  runTasks
} from '../command-utils'
import {readConfig} from '../config'

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
        version.projects.map(project =>
          createSwitchTask(project, getSvnVersionFromConfig(version.name))
        )
      )
      .value()

    runTasks(tasks).catch((error: string | Error) => this.error(error))
  }
}
