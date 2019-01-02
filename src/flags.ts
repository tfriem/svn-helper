import {flags} from '@oclif/command'

export const branch = flags.build({
  char: 'b',
  options: ['trunk', 'branches', 'tags'],
  description: 'branch type'
})

export const quiet = flags.build({char: 'q', description: 'supress svn output'})

export const version = flags.build({char: 'v', description: 'version'})
