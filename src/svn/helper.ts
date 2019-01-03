import {svnLs} from './shell'
import {getUrlFromWorkingCopy} from './url'

/**
 * Returns versions from the svn server.
 * @param path Filesystem path of the working copy
 * @param type  Branch type name ("branches" or "tags")
 */
export async function getVersionsFromServer(
  path: string,
  type: string
): Promise<Array<string>> {
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

  const result = await svnLs(branchesPath)
  let directories = result.stdout.split('\n')
  if (directories.length === 1 && directories[0] === '') {
    directories = []
  }

  const regex = /\/$/
  return directories.map(entry => {
    return entry.replace(regex, '')
  })
}
