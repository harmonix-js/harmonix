import { hash } from 'ohash'
import { dirname, relative } from 'pathe'

import { virtual } from './virtual'

import type { Harmonix } from 'harmonix/types'
import { filename } from 'pathe/utils'

const suffixRegex = /\.(?<method>once|on)?$/

const getImportId = (p: string) => {
  return '_' + hash(p).replace(/-/g, '').slice(0, 8)
}

export const modules = (harmonix: Harmonix) => {
  const rootDir = harmonix.options.rootDir

  return virtual({
    '#harmonix-virtual/modules': () => {
      const modules = [
        ...harmonix.commands.map((c) => ({
          kind: 'command' as const,
          path: relative(rootDir, c.path)
        })),
        ...harmonix.events.map((e) => ({
          kind: 'event' as const,
          path: relative(rootDir, e.path)
        })),
        ...harmonix.components.map((c) => ({
          kind: 'component' as const,
          path: relative(rootDir, c.path)
        }))
      ]

      const enriched = modules.map((m) => {
        const baseName = filename(m.path) || ''
        const dirName = filename(dirname(m.path)) || ''
        const suffixMatch = baseName.match(suffixRegex)
        const eventMethod = suffixMatch?.groups?.method || null

        return { ...m, baseName, dirName, eventMethod }
      })

      const decls = enriched
        .map(
          ({ path }) =>
            `const ${getImportId(path)} = () => import(${JSON.stringify(path)})`
        )
        .join('\n')

      const array = `[\n${enriched
        .map(
          ({ kind, path, baseName, dirName, eventMethod }) =>
            `  { kind: "${kind}", path: ${JSON.stringify(path)}, baseName: ${JSON.stringify(baseName)}, dirName: ${JSON.stringify(dirName)}, eventMethod: ${JSON.stringify(eventMethod)}, load: ${getImportId(path)} }`
        )
        .join(',\n')}\n]`

      const code = /* js */ `${decls}

export const modules = ${array};`

      return code
    }
  })
}
