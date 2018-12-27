import {readJSON} from 'fs-extra'
import * as path from 'path'

export interface ConfigVersion {
  name: string
  projects: Array<string>
}

export interface ConfigRelease {
  name: string
  versions: Array<ConfigVersion>
}

export interface ConfigSubsystem {
  name: string
  projects: Array<string>
}

export interface Config {
  releases: Array<ConfigRelease>
  subsystems: Array<ConfigSubsystem>
}

export async function readConfig(configPath = '.'): Promise<Config> {
  return readJSON(path.join(configPath, '.svnhelper.conf'))
}
