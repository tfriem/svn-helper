import * as execa from 'execa'

export async function svnSwitch(
  path: string,
  url: string
): Promise<SvnShellReturn> {
  return runShellCommand(`svn switch ${url} ${path}`)
}

export async function svnMerge(
  path: string,
  url: string
): Promise<SvnShellReturn> {
  return runShellCommand(`svn merge ${url} ${path}`)
}

export async function svnLs(url: string): Promise<SvnShellReturn> {
  return runShellCommand(`svn ls ${url}`)
}

export async function svnInfoUrl(path: string): Promise<SvnShellReturn> {
  return runShellCommand(`svn info --show-item url ${path}`)
}

async function runShellCommand(cmd: string): Promise<SvnShellReturn> {
  const result = await execa.shell(cmd)

  return {
    failed: result.code !== 0,
    stdout: result.stdout,
    stderr: result.stderr,
    code: result.code
  }
}

export interface SvnShellReturn {
  failed: boolean
  stdout: string
  stderr: string
  code: number
}
