import {BranchType, SvnVersion} from './svn'

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
