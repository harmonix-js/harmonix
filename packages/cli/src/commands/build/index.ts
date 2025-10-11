import { defineCommand } from 'citty'
import { join, resolve } from 'pathe'

import { buildProduction } from './production'
import { getRollupConfig } from './config'
import { prepareDir } from './prepare'
import { rootDirArgs } from '../_shared'
import { loadHarmonix } from '../../utils/kit'

export default defineCommand({
  meta: {
    name: 'build',
    description: 'Build Harmonix for production deployment'
  },
  args: {
    ...rootDirArgs
  },
  async run({ args }) {
    const rootDir = resolve(args.cwd || args.rootDir)
    const { createHarmonix } = await loadHarmonix(rootDir)

    await prepareDir(join(rootDir, '.output'))

    const harmonix = await createHarmonix({ rootDir })
    const config = getRollupConfig(harmonix, rootDir)

    await buildProduction(harmonix, config)
  }
})
