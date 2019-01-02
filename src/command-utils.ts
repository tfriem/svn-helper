import * as c from 'ansi-colors'
import * as fuzzy from 'fuzzy'
import * as indent from 'indent-string'
import * as inquirer from 'inquirer'
import * as Listr from 'listr'
import * as _ from 'lodash'

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

import {
  BranchType,
  getBranchVersions,
  getTagVersions,
  getVersionFromWorkingCopy,
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
  branch: string,
  version?: string
): SvnVersion {
  const branchType = getSvnBranchTypeFromString(branch)
  return new SvnVersion(branchType, version)
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
      throw Error('Could not detect branch type')
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

export function createSwitchTask(
  project: string,
  targetVersion: SvnVersion
): Listr.ListrTask {
  return {
    title: `Switch ${project} to ${svnVersionAsString(targetVersion)}`,
    task: async ctx => {
      const stdout = await switchToVersion(project, targetVersion)
      ctx.results.push({project, output: stdout})
    },
    skip: async () =>
      _.isEqual(await getVersionFromWorkingCopy(project), targetVersion)
  }
}

export async function runTasks(tasks: Array<Listr.ListrTask>, quiet: boolean) {
  try {
    const context = await new Listr(tasks, {
      concurrent: true,
      exitOnError: false
    }).run({
      results: []
    })
    const results = context.results
    if (!quiet) {
      printResults(results)
    }
    return results
  } catch (err) {
    const results = err.context.results
    if (!quiet) {
      printResults(results)
    }

    err.errors.forEach((listError: ListrError) => {
      error(`Command "${listError.cmd}" failed:`)
      error(indent(listError.stderr, 2))
    })
  }
}

export function info(message: string) {
  console.log(message)
}

export function warn(message: string) {
  console.log(c.yellow(message))
}

export function error(message: string) {
  console.log(c.red(message))
}

function printResults(results: Array<TaskResult>) {
  results.forEach(result => {
    info('')
    info(indent(`${result.project} (stdout):`, 2))
    info(indent(`${result.output}`, 4))
  })
}

interface TaskResult {
  project: string
  output: string
}

interface ListrError {
  cmd: string
  stdout: string
  stderr: string
  code: number
}
