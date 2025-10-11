import { createHarmonix, startHarmonix } from 'harmonix'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import { modules } from '#harmonix-virtual/modules'
import { __INLINE_CONFIG__ } from '#harmonix-virtual/config'

import type { HarmonixOptions } from 'harmonix/types'
import type { HarmonixVirtualItem } from '#harmonix-virtual/modules'

const suffixRegex = /\.(?<method>once|on)?$/

export const main = async () => {
  const harmonix = await createHarmonix(__INLINE_CONFIG__)

  harmonix.commands.clear()
  harmonix.events.clear()
  harmonix.components.clear()

  await Promise.all(
    modules.map(async (m) => {
      const mod = await loadModule(m, harmonix.options)

      harmonix[`${m.kind}s`].set(m.path, mod)
    })
  )

  await startHarmonix(harmonix)
}

const loadModule = async (
  meta: HarmonixVirtualItem,
  options: HarmonixOptions
) => {
  const ns = await meta.load()
  const out = ns.default ?? ns
  const base = filename(meta.path) || ''
  const dir = filename(dirname(meta.path)) || ''

  if (!out) return out

  switch (meta.kind) {
    case 'command': {
      out.name ??= base

      if (options.categorization?.inferFromPath) {
        const map = options.categorization?.categories || {}
        const inferred = map[dir] ?? dir
        if (!out.category) out.category = inferred
      }

      out.type ??= 'command'
      break
    }
    case 'event': {
      const m = base.match(suffixRegex)
      const method = m?.groups?.method

      out.once = method === 'once'
      out.type ??= 'event'
      break
    }
    case 'component': {
      out.customId ??= base
      out.type ??= 'component'
      break
    }
  }

  out.path = meta.path

  return out
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
