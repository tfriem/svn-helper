import * as execa from 'execa'

/**
 * Returns the version of a working copy at a given path.
 * @param path Filesystem path of the working copy
 */
export async function getVersionFromWorkingCopy(
  path: string
): Promise<SvnVersion | ParseError> {
  const url = await getUrlFromWorkingCopy(path)
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
  const url = await getUrlFromWorkingCopy(path)
  const newUrl = changeSvnVersionInUrl(url, version)

  return svnSwitch(path, newUrl)
}

export async function getBranchVersions(path: string): Promise<Array<string>> {
  return getVersions(path, 'branches')
}

export async function getTagVersions(path: string): Promise<Array<string>> {
  return getVersions(path, 'tags')
}

async function getVersions(path: string, type: string): Promise<Array<string>> {
  const url = await getUrlFromWorkingCopy(path)
  const chunks = url.split('/')

  let branchesPath = ''
  for (let chunk of chunks) {
    if (chunk === 'branches' || chunk === 'trunk' || chunk === 'tags') {
      branchesPath += type
      break
    }
    branchesPath += chunk + '/'
  }

  const directories = await svnLs(branchesPath)

  const regex = /\/$/
  return directories.map(entry => {
    return entry.replace(regex, '')
  })
}

async function getUrlFromWorkingCopy(path: string): Promise<string> {
  const result = await execa.shell(`svn info --show-item url ${path}`)
  return result.stdout
}

async function svnSwitch(path: string, url: string): Promise<string> {
  const result = await execa.shell(`svn switch ${url} ${path}`)
  return result.stdout
}

async function svnLs(url: string): Promise<Array<string>> {
  const result = await execa.shell(`svn ls ${url}`)
  return result.stdout.split('\n')
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
      // tslint:disable-next-line: no-unused
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
