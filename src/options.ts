import { LoadConfigOptions, loadConfig } from 'c12'
import { resolve } from 'pathe'
import { klona } from 'klona/full'
import type { HarmonixConfig, HarmonixOptions } from './types'
import { createError } from './harmonix'
import defu from 'defu'

const HarmonixDefaults: HarmonixConfig = {
  scanDirs: [],
  ignore: [],
  commands: [],
  events: [],
  contextMenus: [],
  preconditions: [],
  components: {
    buttons: [],
    modals: [],
    selectMenus: []
  }
}

export const loadOptions = async (
  configOverrides: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const loadedConfig = await loadConfig<HarmonixConfig>({
    name: 'harmonix',
    configFile: 'harmonix.config',
    cwd: configOverrides.rootDir,
    dotenv: true,
    overrides: configOverrides,
    defaults: HarmonixDefaults,
    ...opts
  })

  if (!loadedConfig.config) {
    return createError('No configuration found')
  }
  const options = klona(loadedConfig.config) as HarmonixOptions

  options._config = configOverrides
  options._c12 = loadedConfig

  options.rootDir = resolve(options.rootDir || '.')
  options.srcDir = resolve(options.srcDir || options.rootDir)
  options.scanDirs?.unshift(options.srcDir)
  options.scanDirs = options.scanDirs?.map((dir) =>
    resolve(options.srcDir!, dir!)
  )
  options.scanDirs = [...new Set(options.scanDirs)]
  const intents = options.client?.intents || []

  options.client = options.client || {}
  options.client.intents = intents
  options.dirs = defu(options.dirs, {
    commands: 'commands',
    events: 'events',
    contextMenus: 'context-menus',
    components: {
      dir: 'components',
      buttons: 'buttons',
      modals: 'modals',
      selectMenus: 'select-menus'
    },
    preconditions: 'preconditions'
  })

  return options
}
