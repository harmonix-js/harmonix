import type {
  C12InputConfig,
  ConfigWatcher,
  DotenvOptions,
  ResolvedConfig,
  WatchConfigOptions
} from 'c12'
import type { LogLevel } from 'consola'
import type { ClientOptions, Snowflake } from 'discord.js'

import type { DeepPartial } from './utils'
import type { HarmonixPlugin } from './runtime/plugin'

export interface HarmonixDirs {
  commands: string
  events: string
  components: string
}

export interface EnvRef<T = string> {
  __hmx: 'env'
  name: string
  default?: T
  required?: boolean
}

export interface HarmonixOptions {
  _config: HarmonixConfig
  _c12: ResolvedConfig<HarmonixConfig> | ConfigWatcher<HarmonixConfig>

  workspaceDir: string
  rootDir: string
  srcDir: string
  outDir: string
  dirs: HarmonixDirs

  token: string | EnvRef
  clientOptions: ClientOptions

  categorization: {
    inferFromPath: boolean
    categories: {
      [key: string]: string
    }
  }
  plugins: HarmonixPlugin[]

  logLevel: LogLevel
  ignore: string[]

  dev: boolean
  devGuild: Snowflake

  logging: {
    compressedSizes: boolean
    buildSuccess: boolean
  }

  sourceMap: boolean | 'inline' | 'hidden'
}

export interface HarmonixConfig
  extends DeepPartial<Omit<HarmonixOptions, '_config' | '_c12'>>,
    C12InputConfig<HarmonixConfig> {}

export interface LoadConfigOptions {
  watch?: boolean
  c12?: WatchConfigOptions
  dotenv?: boolean | DotenvOptions
}
