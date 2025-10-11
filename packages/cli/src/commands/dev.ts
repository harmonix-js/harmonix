import { defineCommand } from 'citty'
import { resolve } from 'pathe'

import { rootDirArgs } from './_shared'
import { overrideEnv } from '../utils/env'
import { showVersion } from '../utils/banner'
import { logger } from '../utils/logger'

import type { Harmonix } from 'harmonix/types'
import { loadHarmonix } from '../utils/kit'

export default defineCommand({
  meta: {
    name: 'dev',
    description: 'Run Harmonix in development mode'
  },
  args: {
    ...rootDirArgs
  },
  async run({ args }) {
    overrideEnv('development')
    const rootDir = resolve(args.cwd || args.rootDir)
    const { startHarmonix, createHarmonix } = await loadHarmonix(rootDir)

    await showVersion(rootDir)
    let harmonix: Harmonix
    const reload = async () => {
      if (harmonix) {
        await harmonix.close()
      }

      harmonix = await createHarmonix(
        { rootDir, dev: true },
        {
          watch: true,
          c12: {
            onUpdate: async ({ getDiff }) => {
              const diff = getDiff()

              if (diff.length === 0) return

              logger.info('harmonix.config.ts updated. Restarting client...')
              reload()
            }
          }
        }
      )

      await startHarmonix(harmonix)
    }

    await reload()
  }
})
