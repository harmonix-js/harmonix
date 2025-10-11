import { dirname, resolve } from 'pathe'
import type { Plugin } from 'rollup'

type VirtualModule = string | (() => string | Promise<string>)

interface RollupVirtualOptions {
  [id: string]: VirtualModule
}

const PREFIX = '\0virtual:'

export const virtual = (
  modules: RollupVirtualOptions,
  cache: Record<string, VirtualModule> = {}
): Plugin => {
  const _modules = new Map<string, VirtualModule>()

  for (const [id, mod] of Object.entries(modules)) {
    cache[id] = mod
    _modules.set(id, mod)
    _modules.set(resolve(id), mod)
  }

  return {
    name: 'virtual',
    resolveId: (id, importer) => {
      if (id in modules) {
        return PREFIX + id
      }

      if (importer) {
        const importerNoPrefix = importer.startsWith(PREFIX)
          ? importer.slice(PREFIX.length)
          : importer
        const resolved = resolve(dirname(importerNoPrefix), id)

        if (_modules.has(resolved)) {
          return PREFIX + resolved
        }
      }

      return null
    },

    load: async (id) => {
      if (!id.startsWith(PREFIX)) {
        return null
      }
      const idNoPrefix = id.slice(PREFIX.length)

      if (!_modules.has(idNoPrefix)) {
        return null
      }
      let m = _modules.get(idNoPrefix)

      if (typeof m === 'function') {
        m = await m()
      }

      if (!m) {
        return null
      }

      cache[id.replace(PREFIX, '')] = m

      return {
        code: m as string,
        map: null
      }
    }
  }
}
