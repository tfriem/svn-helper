import inquirer = require('inquirer')

import {BranchType, getBranches, getTags, SvnVersion} from './svn'

export function versionRequired(branchType: BranchType): boolean {
  return branchType !== BranchType.TRUNK
}

export async function askForVersion(
  path: string,
  type: BranchType
): Promise<string> {
  let versions
  if (type === BranchType.BRANCH) {
    versions = await getBranches(path)
  } else if (type === BranchType.TAG) {
    versions = await getTags(path)
  }
  const responses: {version: string} = await inquirer.prompt([
    {
      name: 'version',
      type: 'list',
      choices: versions
    }
  ])

  return responses.version
}

export async function askForBranch(): Promise<string> {
  const responses: {branch: string} = await inquirer.prompt([
    {
      name: 'branch',
      type: 'list',
      choices: ['trunk', 'branches', 'tags']
    }
  ])

  return responses.branch
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
