import {flags} from '@oclif/command'

export const branchFlag = flags.enum({
  char: 'b',
  options: ['trunk', 'branches', 'tags'],
  description: 'branch type'
})

export const quietFlag = flags.boolean({
  char: 'q',
  description: 'supress svn output'
})

export const versionFlag = flags.string({char: 'v', description: 'version'})

export const concurrencyFlag = flags.integer({
  char: 'c',
  description: 'number of concurrent running tasks (0 = infinity)'
})

export const helpFlag = flags.help({char: 'h'})
