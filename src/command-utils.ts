import * as fuzzy from 'fuzzy'
import inquirer = require('inquirer')
import * as Listr from 'listr'

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

import {
  BranchType,
  getBranchVersions,
  getTagVersions,
  SvnVersion,
  switchToVersion
} from './svn'

export function versionRequired(branchType: BranchType): boolean {
  return branchType !== BranchType.TRUNK
}

export async function askForVersion(
  path: string,
  type: BranchType
): Promise<string> {
  let versions: Array<string>
  if (type === BranchType.BRANCH) {
    versions = await getBranchVersions(path)
  } else if (type === BranchType.TAG) {
    versions = await getTagVersions(path)
  } else {
    throw Error('Trunk has no versions')
  }

  return ask('Version', versions)
}

export async function askForBranch(): Promise<string> {
  return ask('Branch', ['trunk', 'branches', 'tags'])
}

export async function ask(
  topic: string,
  options: Array<string>
): Promise<string> {
  const responses: {result: string} = await inquirer.prompt([
    {
      name: 'result',
      type: 'autocomplete',
      message: topic,
      // @ts-ignore
      source: async (_, input: string) => {
        input = input || ''
        return fuzzy.filter(input, options).map(res => res.original)
      }
    }
  ])

  return responses.result
}

export function getSvnVersionFromStrings(
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

export function getSvnBranchTypeFromString(branchType: string): BranchType {
  switch (branchType) {
    case 'trunk':
      return BranchType.TRUNK
    case 'branches':
      return BranchType.BRANCH
    case 'tags':
      return BranchType.TAG
    default:
      throw Error('Couldn not detect branch type')
  }
}

export function getSvnVersionFromConfig(versionString: string): SvnVersion {
  const [branchType, version] = versionString.split('/')
  return getSvnVersionFromStrings(branchType, version)
}

export function svnVersionAsString(version: SvnVersion): string {
  switch (version.type) {
    case BranchType.TRUNK:
      return 'trunk'
    case BranchType.BRANCH:
      return `branches/${version.version}`
    case BranchType.TAG:
      return `tags/${version.version}`
  }
}

export function createSwitchTask(project: string, targetVersion: SvnVersion) {
  return {
    title: `Switch ${project} to ${svnVersionAsString(targetVersion)}`,
    task: () => switchToVersion(project, targetVersion)
  }
}

export function runTasks(tasks: Array<Listr.ListrTask>) {
  return new Listr(tasks, {concurrent: true, exitOnError: false}).run()
}
