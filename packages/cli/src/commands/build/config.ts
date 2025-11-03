import { builtinModules } from 'node:module'
import { sanitizeFilePath } from 'mlly'
import { dirname, normalize, relative } from 'pathe'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import { modules } from './plugins/modules'
import { config } from './plugins/config'
import { resolveEntry } from '../../utils/entry'

import type { RollupOptions } from 'rollup'
import type { Harmonix } from 'harmonix/types'

export const getRollupConfig = (
  harmonix: Harmonix,
  rootDir: string
): RollupOptions => {
  return {
    input: resolveEntry('./runtime/harmonix.mjs', import.meta.url),
    external: [
      'discord.js',
      ...builtinModules,
      ...builtinModules.map((m) => `node:${m}`)
    ],
    plugins: [
      config(harmonix.options),
      modules(harmonix),
      nodeResolve({
        preferBuiltins: true,
        rootDir,
        mainFields: ['module', 'exports', 'main']
      }),
      commonjs({
        strictRequires: 'auto',
        requireReturnsDefault: 'auto',
        ignoreDynamicRequires: true
      }),
      json()
    ],
    onwarn: (warning, rollupWarn) => {
      if (
        !['CIRCULAR_DEPENDENCY', 'EVAL'].includes(warning.code || '') &&
        !warning.message.includes('Unsupported source map content')
      ) {
        rollupWarn(warning)
      }
    },
    treeshake: true,
    output: {
      dir: harmonix.options.outDir,
      entryFileNames: 'index.mjs',
      chunkFileNames: (chunk) => {
        const id = normalize(chunk.moduleIds.at(-1) || '')
        const modules = [
          ...harmonix.commands.map((c) => c.path),
          ...harmonix.events.map((e) => e.path),
          ...harmonix.components.map((c) => c.path)
        ]

        const handler = modules.find((m) => id.startsWith(m))

        if (handler) {
          const path = dirname(relative(rootDir, handler))

          return `chunks/modules/${path}/[name].mjs`
        }

        return 'chunks/_/[name].mjs'
      },
      format: 'esm',
      exports: 'auto',
      sanitizeFileName: sanitizeFilePath,
      sourcemap: harmonix.options.sourceMap,
      sourcemapIgnoreList: (p) => p.includes('node_modules')
    }
  }
}
