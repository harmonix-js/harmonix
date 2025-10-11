import { consola } from 'consola'
import { createHooks } from 'hookable'
import { Client, Collection } from 'discord.js'

import { scanModule } from './scan'
import { runWithHarmonixContext } from './context'
import { loadOptions } from './config/loader'
import { ModuleType } from './types/module'
import { handleModules, watchModules } from './module'
import { loadModule, registerModule } from './runtime/internal/module'
import { isEnvRef, resolveEnvRef } from './config/env'
import { syncCommands } from './discord/api/sync'

import type { HarmonixConfig, LoadConfigOptions } from './types/config'
import type { Harmonix } from './types/harmonix'
import type { HarmonixHooks } from './types/hooks'

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadOptions(config, opts)
  const hooks = createHooks<HarmonixHooks>()
  const _callHook = hooks.callHook.bind(hooks)
  const _hook = hooks.hook.bind(hooks)

  hooks.callHook = (...args) =>
    runWithHarmonixContext(harmonix, () => _callHook(...args))
  hooks.hook = (...args) => _hook(...args)

  const harmonix: Harmonix = {
    options,
    hooks,
    callHook: hooks.callHook,
    hook: hooks.hook,
    logger: consola.withTag('harmonix'),
    client: new Client(options.clientOptions),
    commands: new Collection(),
    events: new Collection(),
    components: new Collection(),
    close: async () => {
      harmonix.client.removeAllListeners()
      await harmonix.client.destroy()
    }
  }

  if (harmonix.options.logLevel !== undefined) {
    harmonix.logger.level = harmonix.options.logLevel
  }

  for (const plugin of harmonix.options.plugins) {
    await plugin.setup(harmonix)
  }

  await harmonix.callHook('modules:dirs', harmonix.options.dirs)
  const modules = [
    ...(await scanModule(harmonix, ModuleType.Command)),
    ...(await scanModule(harmonix, ModuleType.Event)),
    ...(await scanModule(harmonix, ModuleType.Component))
  ]

  await harmonix.callHook('modules:extend', modules)
  for (const mod of modules) {
    const module = await loadModule(mod.fullPath, harmonix.options)

    registerModule(harmonix, module, mod.fullPath)
  }

  return harmonix
}

export const startHarmonix = async (harmonix: Harmonix) => {
  harmonix.client.on('clientReady', async () => {
    await harmonix.callHook('ready', harmonix.client as Client<true>)
  })

  handleModules(harmonix)

  await harmonix.callHook('login:before', harmonix.client)

  if (isEnvRef(harmonix.options.token)) {
    harmonix.options.token = resolveEnvRef(harmonix.options.token)!
  }

  await harmonix.client.login(harmonix.options.token)
  await harmonix.callHook('login:after', harmonix.client)
  await syncCommands(harmonix as Harmonix<true>)

  if (harmonix.options.dev) {
    await watchModules(harmonix)
  }

  return harmonix
}
