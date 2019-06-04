import { SvnShellReturn } from '../src/svn/shell'

export function mocked<T>(
  val: T
): T extends (...args: any[]) => any ? jest.MockInstance<T, any[]> : jest.Mocked<T> {
  return val as any
}

export function successfulShellReturn(stdout = ''): SvnShellReturn {
  return {
    failed: false,
    code: 0,
    stdout,
    stderr: ''
  }
}
