import {exec} from 'child_process'
import {promisify} from 'util'

const execute = promisify(exec)

/**
 * Returns the version of a working copy at a given path.
 * @param path
 */
export async function getVersion(
  path: string
): Promise<SvnVersion | ParseError> {
  const url = await getUrl(path)
  return getSvnVersionFromUrl(url)
}

/**
 * Switches a working copy to a given version.
 * @param path Filesystem path of the working copy
 * @param version Target version
 * @returns Stdout of the svn switch call
 */
export async function switchToVersion(
  path: string,
  version: SvnVersion
): Promise<string> {
  const url = await getUrl(path)
  const newUrl = changeSvnVersionInUrl(url, version)

  return svnSwitch(path, newUrl)
}

async function getUrl(path: string): Promise<string> {
  return (await execute(`svn info --show-item url ${path}`)).stdout.trim()
}

export async function svnSwitch(path: string, url: string) {
  return (await execute(`svn switch ${url} ${path}`)).stdout.trim()
}

function getSvnVersionFromUrl(url: string): SvnVersion | ParseError {
  const regex = /(trunk|branches\/[^\/]*|tags\/[^\/]*)/
  const match = regex.exec(url)

  if (!match) {
    return {error: 'Could not parse version from URL'}
  }
  const chunks = match[1].split('/')
  if (chunks.length === 1 && chunks[0] === 'trunk') {
    return {type: BranchType.TRUNK}
  }

  if (chunks.length === 2) {
    const version = chunks[1]
    if (chunks[0] === 'branches') {
      return {type: BranchType.BRANCH, version}
    }
    if (chunks[0] === 'tags') {
      return {type: BranchType.TAG, version}
    }
  }

  return {error: 'Could not parse version from URL'}
}

export function changeSvnVersionInUrl(
  url: string,
  newVersion: SvnVersion
): string {
  let targetString
  switch (newVersion.type) {
    case BranchType.TRUNK:
      targetString = 'trunk'
      break
    case BranchType.BRANCH:
      targetString = `branches/${newVersion.version}`
      break
    case BranchType.TAG:
      targetString = `tags/${newVersion.version}`
      break
    default:
      const _exhaustiveCheck: never = newVersion
      targetString = 'ERROR'
  }
  const regex = /(trunk|branches\/[^\/]*|tags\/[^\/]*)/
  return url.replace(regex, targetString)
}

interface Trunk {
  type: BranchType.TRUNK
}

interface Branch {
  type: BranchType.BRANCH
  version: string
}

interface Tag {
  type: BranchType.TAG
  version: string
}

export type SvnVersion = Trunk | Branch | Tag

export interface ParseError {
  error: string
}

export enum BranchType {
  TRUNK,
  BRANCH,
  TAG
}
