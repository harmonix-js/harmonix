import type { LoadConfigOptions } from 'c12'
import { getContext } from 'unctx'
import consola from 'consola'
import { colors } from 'consola/utils'
import { watch } from 'chokidar'
import { resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import type { Stats } from 'node:fs'
import { loadOptions } from './options'
import { scanAndSyncOptions } from './scan'
import {
  installButtons,
  installCommands,
  installContextMenus,
  installEvents,
  installModals,
  installPreconditions,
  installSelectMenus
} from './load'
import { initCient, refreshApplicationCommands } from './discord'
import {
  registerContextMenu,
  registerEvents,
  registerCommands,
  registerButtons,
  registerModals,
  registerSelectMenus,
  registerAutocomplete
} from './register'
import type {
  Harmonix,
  HarmonixConfig,
  RuntimeHarmonix,
  HarmonixHooks
} from './types'
import { version } from '../package.json'
import { createHooks } from 'hookable'

export const ctx = getContext<RuntimeHarmonix>('harmonix')
export const useHarmonix = ctx.use

const createHarmonix = async (
  config: HarmonixConfig,
  options: LoadConfigOptions
): Promise<Harmonix> => {
  const opts = await loadOptions(config, options)
  const harmonix: Harmonix = {
    options: opts,
    hooks: createHooks<HarmonixHooks>(),
    logger: consola.withTag('harmonix')
  }

  await scanAndSyncOptions(harmonix)
  harmonix.hooks.addHooks(harmonix.options.hooks)

  return harmonix
}

const watchReload = (
  harmonix: Harmonix,
  config: HarmonixConfig,
  opts: LoadConfigOptions
) => {
  const filesToWatch = [
    harmonix.options.dirs.commands,
    harmonix.options.dirs.events,
    harmonix.options.dirs.contextMenus,
    harmonix.options.dirs.components.buttons,
    harmonix.options.dirs.components.modals,
    harmonix.options.dirs.components.selectMenus,
    harmonix.options.dirs.preconditions
  ].map((file) => resolve(harmonix.options.rootDir, file))
  const watcher = watch([...filesToWatch, harmonix.options._c12.configFile!], {
    ignored: harmonix.options.ignore,
    ignoreInitial: true
  })
  const reload = debounce(
    async (event: string, path: string, stats: Stats | undefined) => {
      if (stats?.size === 0) return
      consola.info(
        `${colors.blue(event)}`,
        `${colors.gray(resolve(path).replace(harmonix.options.rootDir, ''))}`
      )
      clearHarmonix(harmonix)
      try {
        await loadHarmonix(harmonix)
      } catch (error: any) {
        createError(error.message)
      }
    },
    100
  )

  watcher.on('all', (event, path, stats) => reload(event, path, stats))
}

export const initHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  if (!process.env.DISCORD_CLIENT_TOKEN) {
    createError(
      'Client token is required. Please provide it in the environment variable DISCORD_CLIENT_TOKEN.'
    )
  }
  const harmonix = await createHarmonix(config, opts)

  harmonix.logger.log(colors.blue(`Harmonix ${colors.bold(version)}\n`))
  await loadHarmonix(harmonix)

  if (process.env.NODE_ENV === 'development') {
    watchReload(harmonix, config, opts)
  }

  return harmonix
}

const clearHarmonix = async (harmonix: Harmonix) => {
  harmonix.client?.destroy()
  harmonix.client?.events.clear()
  harmonix.client?.commands.clear()
  harmonix.client?.contextMenus.clear()
  harmonix.client?.components.buttons.clear()
  harmonix.client?.components.modals.clear()
  harmonix.client?.components.selectMenus.clear()
  harmonix.client?.preconditions.clear()
}

const isRuntimeHarmonix = (harmonix: Harmonix): harmonix is RuntimeHarmonix => {
  return 'client' in harmonix
}

const loadHarmonix = async (harmonix: Harmonix) => {
  harmonix.client = initCient(harmonix.options)

  if (!isRuntimeHarmonix(harmonix)) {
    return createError('Error while initializing client')
  }

  installEvents(harmonix)
  installCommands(harmonix)
  installContextMenus(harmonix)
  installPreconditions(harmonix)
  installButtons(harmonix)
  installModals(harmonix)
  installSelectMenus(harmonix)

  registerEvents(harmonix)
  await refreshApplicationCommands(harmonix)
  registerCommands(harmonix)
  registerContextMenu(harmonix)
  registerButtons(harmonix)
  registerModals(harmonix)
  registerSelectMenus(harmonix)
  registerAutocomplete(harmonix)
}

export const createError = (message: string) => {
  consola.error(new Error(message))
  process.exit(1)
}
