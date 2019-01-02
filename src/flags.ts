import {flags} from '@oclif/command'

export const branchFlag = flags.build({
  char: 'b',
  options: ['trunk', 'branches', 'tags'],
  description: 'branch type'
})

export const quietFlag = flags.build({
  char: 'q',
  description: 'supress svn output'
})

export const versionFlag = flags.build({char: 'v', description: 'version'})
