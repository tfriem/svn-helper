/**
 * Branch types for "trunk", "branches" and "tags"
 */
export enum BranchType {
  TRUNK,
  BRANCH,
  TAG
}

/**
 * Represents a specific software version in a subversion repository.
 * Versions are destinguished by the branch type and a version string.
 */
export class SvnVersion {
  private static readonly trunk = new SvnVersion(BranchType.TRUNK)

  static get Trunk(): SvnVersion {
    return SvnVersion.trunk
  }

  constructor(
    readonly type: BranchType,
    readonly version: string | null = null
  ) {
    if (type === BranchType.TRUNK && version !== null) {
      throw new Error('Trunk must not have a version.')
    }
    if (type !== BranchType.TRUNK && !version) {
      throw new Error('Branches and tags require a version.')
    }
  }
}
