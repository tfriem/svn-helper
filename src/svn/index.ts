import {xml2js} from 'xml-js'

import {getVersionsFromServer} from './helper'
import {svnLogXml, svnMerge, svnMergeInfo, svnSwitch} from './shell'
import {
  changeSvnVersionInUrl,
  getSvnVersionFromUrl,
  getUrlFromWorkingCopy
} from './url'
import {SvnVersion} from './version'

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

  const result = await svnSwitch(path, newUrl)

  if (result.failed) {
    throw Error(result.stderr)
  }

  return result.stdout
}

/**
 * Returns the version of a working copy at a given path.
 * @param path Filesystem path of the working copy
 */
export async function getVersionFromWorkingCopy(
  path: string
): Promise<SvnVersion> {
  const url = await getUrlFromWorkingCopy(path)
  return getSvnVersionFromUrl(url)
}

/**
 * Merges a given version into the given working copy.
 * @param path Filesystem path of the working copy
 * @param version Version to merge from
 */
export async function mergeFromVersion(
  path: string,
  version: SvnVersion,
  revisions: Array<number>
): Promise<string> {
  const url = await getUrlFromWorkingCopy(path)
  const newUrl = changeSvnVersionInUrl(url, version)

  const result = await svnMerge(path, newUrl, revisions)

  if (result.failed) {
    throw Error(result.stderr)
  }

  return result.stdout
}

/**
 * Returns all "branches" versions from the SVN server.
 * @param path Filesystem path of the working copy
 */
export async function getBranchVersions(path: string): Promise<Array<string>> {
  return getVersionsFromServer(path, 'branches')
}

/**
 * Returns all "tags" versions from the SVN server.
 * @param path Filesystem path of the working copy
 */
export async function getTagVersions(path: string): Promise<Array<string>> {
  return getVersionsFromServer(path, 'tags')
}

export async function getEligible(
  path: string,
  version: SvnVersion
): Promise<Array<number>> {
  const url = await getUrlFromWorkingCopy(path)
  const newUrl = changeSvnVersionInUrl(url, version)

  const result = await svnMergeInfo(path, newUrl)

  return result.stdout
    .split(/\r?\n/)
    .map(str => parseInt(str.replace('r', ''), 10))
}

export async function getLogsFromVersion(
  path: string,
  version: SvnVersion,
  revisions: Array<number>
): Promise<Array<LogEntry>> {
  const url = await getUrlFromWorkingCopy(path)
  const newUrl = changeSvnVersionInUrl(url, version)

  const result = await svnLogXml(newUrl, revisions)

  // @ts-ignore
  const logs = xml2js(result.stdout, {compact: true}).log.logentry

  return logs.map(
    (log: {
      _attributes: {revision: string}
      author: {_text: any}
      msg: {_text: any}
    }) => {
      return {
        revision: parseInt(log._attributes.revision, 10),
        author: log.author._text,
        message: log.msg._text
      }
    }
  )
}

export interface LogEntry {
  revision: number
  author: string
  message: string
}

export {BranchType, SvnVersion} from './version'
