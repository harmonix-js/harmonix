import { defineCommand } from 'citty'
import { detectPackageManager, addDependency } from 'nypm'

import { rootDirArgs } from './_shared'
import { logger } from '../utils/logger'

export default defineCommand({
  meta: {
    name: 'upgrade',
    description: 'Upgrade Harmonix'
  },
  args: {
    ...rootDirArgs
  },
  async run(ctx) {
    logger.start('Updating dependencies...')
    try {
      const packageManager = await detectPackageManager(ctx.args.cwd)

      await addDependency('harmonix@latest', {
        cwd: ctx.args.cwd,
        packageManager,
        silent: true
      })
      logger.log(`✨ Harmonix have been upgraded.`)
    } catch (error) {
      logger.error((error as Error).toString())
      process.exit(1)
    }
  }
})
