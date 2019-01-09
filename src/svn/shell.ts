import * as execa from 'execa'

export async function svnSwitch(
  path: string,
  url: string
): Promise<SvnShellReturn> {
  return runShellCommand(`svn switch ${url} ${path}`)
}

export async function svnMerge(
  path: string,
  url: string,
  revisions: Array<number>
): Promise<SvnShellReturn> {
  console.log(`svn merge ${createRevisionParameter(revisions)} ${url} ${path}`)
  return runShellCommand(
    `svn merge ${createRevisionParameter(revisions)} ${url} ${path}`
  )
}

export async function svnLs(url: string): Promise<SvnShellReturn> {
  return runShellCommand(`svn ls ${url}`)
}

export async function svnInfoUrl(path: string): Promise<SvnShellReturn> {
  return runShellCommand(`svn info --show-item url ${path}`)
}

export async function svnMergeInfo(
  path: string,
  url: string
): Promise<SvnShellReturn> {
  return runShellCommand(`svn mergeinfo --show-revs eligible ${url} ${path}`)
}

export async function svnLogXml(
  url: string,
  revisions: Array<number>
): Promise<SvnShellReturn> {
  return runShellCommand(
    `svn log --stop-on-copy --xml ${createRevisionParameter(revisions)} ${url}`
  )
}

function createRevisionParameter(revisions: Array<number>): string {
  return `-c${revisions.join(',')}`
}

async function runShellCommand(cmd: string): Promise<SvnShellReturn> {
  const result = await execa.shell(cmd)

  return {
    failed: result.code !== 0,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    code: result.code
  }
}

export interface SvnShellReturn {
  failed: boolean
  stdout: string
  stderr: string
  code: number
}
