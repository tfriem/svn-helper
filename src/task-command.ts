import Command from '@oclif/command'
import * as Listr from 'listr'

import {runTasks} from './command-utils'
import {concurrencyFlag, helpFlag, quietFlag} from './flags'

export abstract class TaskCommand extends Command {
  static flags = {
    concurrency: concurrencyFlag,
    quiet: quietFlag,
    help: helpFlag
  }
  private concurrency = 0
  private quiet = false

  async init() {
    const {flags} = this.parse(this.ctor)
    this.concurrency = flags.concurrency
    this.quiet = flags.quiet
  }

  async runTasks(tasks: Array<Listr.ListrTask>) {
    return runTasks(tasks, this.quiet, this.concurrency)
  }
}
