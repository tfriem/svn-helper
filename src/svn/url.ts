import {svnInfoUrl} from './shell'
import {BranchType, SvnVersion} from './version'

/**
 * Returns the svn url from a working copy.
 * @param path Filesystem path of the working copy
 */
export async function getUrlFromWorkingCopy(path: string) {
  const result = await svnInfoUrl(path)
  return result.stdout
}

/**
 * Returns the version from an url
 * @param url svn url
 */
export function getSvnVersionFromUrl(url: string): SvnVersion {
  const regex = /(trunk|branches\/[^\/]*|tags\/[^\/]*)/
  const match = regex.exec(url)

  if (!match) {
    throw Error('Could not parse version from URL')
  }

  const chunks = match[1].split('/')
  if (chunks.length === 1 && chunks[0] === 'trunk') {
    return SvnVersion.Trunk
  }

  if (chunks.length === 2 && chunks[1] !== '') {
    const version = chunks[1]
    if (chunks[0] === 'branches') {
      return new SvnVersion(BranchType.BRANCH, version)
    }
    if (chunks[0] === 'tags') {
      return new SvnVersion(BranchType.TAG, version)
    }
  }

  throw Error('Could not parse version from URL')
}

/**
 * Replaces the version part in an url with another version.
 * @param url A svn url including a version
 * @param targetVersion Version in new url
 */
export function changeSvnVersionInUrl(
  url: string,
  targetVersion: SvnVersion
): string {
  let targetString
  switch (targetVersion.type) {
    case BranchType.TRUNK:
      targetString = 'trunk'
      break
    case BranchType.BRANCH:
      targetString = `branches/${targetVersion.version}`
      break
    case BranchType.TAG:
      targetString = `tags/${targetVersion.version}`
      break
    default:
      throw Error('Target version is invalid')
  }
  const regex = /trunk|branches\/?[^\/]*|tags\/?[^\/]*/
  return url.replace(regex, targetString)
}
