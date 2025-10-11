import { stat } from 'node:fs/promises'
import { relative, resolve } from 'pathe'
import { filename } from 'pathe/utils'
import { debounce } from 'perfect-debounce'
import { colors } from 'consola/utils'

import { runWithHarmonixContext } from './context'
import { ModuleType } from './types/module'
import { handleInteractionCreate } from './discord/handlers'
import { handleEvent } from './discord/handlers/event'
import {
  loadModule,
  registerModule,
  disposeModule
} from './runtime/internal/module'
import { valuesOf } from './utils/helpers'

import type { Harmonix } from './types/harmonix'
import { upsertCommand } from './discord/api/upsert'

interface AsyncSubscription {
  unsubscribe(): Promise<void>
}

interface Event {
  path: string
  type: 'create' | 'update' | 'delete'
}

const handleChanges = debounce(async (harmonix: Harmonix, events: Event[]) => {
  for (const event of events) {
    const path = resolve(event.path)
    harmonix.logger.info(
      `\u001B[38;2;75;67;238mhmr update\u001B[0m ${colors.dim(relative(harmonix.options.srcDir, path))}`
    )

    if (event.type === 'delete') {
      await disposeModule(harmonix, path)
    } else {
      const module = await loadModule(path, harmonix.options)

      if (module.type === ModuleType.Command) {
        const existing = harmonix.commands.get(path)
        const renamed = existing && existing.name !== module.name

        if (renamed) await disposeModule(harmonix, path)

        registerModule(harmonix, module, path)
        await upsertCommand(harmonix, module)
        continue
      }

      registerModule(harmonix, module, path)

      if (module.type === ModuleType.Event) {
        handleEvent(harmonix, module, path)
      }
    }
  }
}, 150)

const trySubscribeDir = async (
  harmonix: Harmonix,
  dir: string,
  watchers: Map<string, AsyncSubscription>
) => {
  if (watchers.has(dir)) return
  const st = await stat(dir).catch(() => null)

  if (!st || !st.isDirectory()) return
  const { subscribe } = await import('@parcel/watcher')
  const watcher = await subscribe(dir, async (_, events) => {
    // Unknown error is defined when the directory is deleted
    await harmonix.callHook('modules:watch', events)
    handleChanges(harmonix, events)
  })

  watchers.set(dir, watcher)
}

const tryUnsubscribeDir = async (
  dir: string,
  watchers: Map<string, AsyncSubscription>
) => {
  const watcher = watchers.get(dir)

  if (!watcher) return
  await watcher.unsubscribe()
  watchers.delete(dir)
}

export const watchModules = async (harmonix: Harmonix) => {
  const { subscribe } = await import('@parcel/watcher')
  const watchers = new Map<string, AsyncSubscription>()
  const dirs = new Set(valuesOf(harmonix.options.dirs))

  for (const dir of dirs) {
    await trySubscribeDir(harmonix, dir, watchers)
  }

  await subscribe(
    harmonix.options.srcDir,
    async (err, events) => {
      if (err) throw err

      for (const event of events) {
        const dir = resolve(event.path)

        if (!dirs.has(dir)) continue

        if (event.type === 'delete') {
          await tryUnsubscribeDir(dir, watchers)
        } else {
          await trySubscribeDir(harmonix, dir, watchers)
        }

        harmonix.logger[event.type === 'delete' ? 'debug' : 'info'](
          `Directory ${colors.cyan(`${filename(dir)}/`)} ${event.type}d.`
        )
      }
    },
    { ignore: harmonix.options.ignore }
  )
}

export const handleModules = (harmonix: Harmonix) => {
  for (const [filePath, event] of harmonix.events) {
    handleEvent(harmonix, event, filePath)
  }

  harmonix.client.on('interactionCreate', async (interaction) => {
    await harmonix.callHook('interaction:before', interaction)
    runWithHarmonixContext(harmonix, () =>
      handleInteractionCreate(harmonix, interaction)
    )
    await harmonix.callHook('interaction:after', interaction)
  })
  harmonix.logger.info('Listening for events...')
}
