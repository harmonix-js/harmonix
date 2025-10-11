import { createJiti } from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'

import { deleteCommand } from '../../discord/api/delete'
import { eventHandlers } from '../../discord/handlers/event'
import { ModuleType } from '../../types/module'

import type { AnyModule } from '../../types/helper'
import type { Harmonix } from '../../types/harmonix'
import type { HarmonixOptions } from '../../types/config'

const suffixRegex = /\.(?<method>once|on)?$/

export const loadModule = async <T extends AnyModule>(
  filePath: string,
  harmonixOptions: HarmonixOptions
) => {
  const jiti = createJiti(harmonixOptions.rootDir, { moduleCache: false })
  const path = jiti.esmResolve(filePath)
  const module = await jiti.import<T>(path, { default: true })

  module.name ??= filename(path)!
  module.path = filePath

  if (
    module.type === ModuleType.Command &&
    harmonixOptions.categorization.inferFromPath
  ) {
    const category = filename(dirname(path))!

    module.category ??=
      harmonixOptions.categorization.categories[category] ?? category
  }

  if (module.type === ModuleType.Event) {
    const suffixMatch = filename(path)?.match(suffixRegex)
    const method = suffixMatch?.groups?.method

    module.once = method === 'once'
  }

  if (module.type === ModuleType.Component) {
    module.customId ??= filename(path)!
  }

  return module
}

export const registerModule = (
  harmonix: Harmonix,
  module: AnyModule,
  filePath: string
) => {
  switch (module.type) {
    case ModuleType.Command: {
      harmonix.commands.set(filePath, module)
      break
    }
    case ModuleType.Event: {
      harmonix.events.set(filePath, module)
      break
    }
    case ModuleType.Component: {
      harmonix.components.set(filePath, module)
      break
    }
  }
}

export const disposeModule = async (harmonix: Harmonix, path: string) => {
  const module =
    harmonix.events.get(path) ||
    harmonix.commands.get(path) ||
    harmonix.components.get(path)

  if (!module) return

  switch (module.type) {
    case ModuleType.Event: {
      const handler = eventHandlers.get(path)

      if (handler) {
        harmonix.client.removeListener(module.name, handler)
        eventHandlers.delete(path)
      }
      harmonix.events.delete(path)
      break
    }
    case ModuleType.Command: {
      await deleteCommand(harmonix, module.name)
      harmonix.commands.delete(path)
      break
    }
    case ModuleType.Component: {
      harmonix.components.delete(path)
      break
    }
  }
}
