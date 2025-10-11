import { klona } from 'klona/full'
import { resolve } from 'pathe'
import { findWorkspaceDir } from 'pkg-types'
import { loadConfig, watchConfig } from 'c12'

import { HarmonixDefaults } from './defaults'

import type {
  HarmonixConfig,
  HarmonixOptions,
  LoadConfigOptions
} from '../types/config'
import { resolveHarmonixPath } from '../utils/fs'

export const loadOptions = async (
  configOverrides: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadUserConfig(configOverrides, opts)

  options.rootDir = resolve(options.rootDir || '.')
  options.workspaceDir ||= await findWorkspaceDir(options.rootDir).catch(
    () => options.rootDir
  )

  options.srcDir = resolve(options.rootDir, options.srcDir || '.')
  options.outDir = resolveHarmonixPath(options.outDir, options, options.rootDir)

  options.dirs = {
    commands: resolve(options.srcDir, options.dirs.commands),
    events: resolve(options.srcDir, options.dirs.events),
    components: resolve(options.srcDir, options.dirs.components)
  }

  return options
}

const loadUserConfig = async (
  configOverrides: HarmonixConfig,
  opts: LoadConfigOptions
) => {
  configOverrides = klona(configOverrides)

  const loadedConfig = await (
    opts.watch ? watchConfig<HarmonixConfig> : loadConfig<HarmonixConfig>
  )({
    name: 'harmonix',
    cwd: configOverrides.rootDir,
    dotenv: opts.dotenv ?? true,
    overrides: configOverrides,
    defaults: HarmonixDefaults,
    ...opts.c12
  })

  const options = klona(loadedConfig.config) as HarmonixOptions

  options._config = configOverrides
  options._c12 = loadedConfig

  return options
}
