import { colors } from 'consola/utils'
import { readPackageJSON } from 'pkg-types'

import { tryResolveHarmonix } from './kit'
import { logger } from './logger'
import { themeColor } from './ascii'

export const showVersion = async (cwd: string) => {
  const harmonixDir = tryResolveHarmonix(cwd)

  const getPkgVersion = async (pkg: string) => {
    for (const url of [cwd, harmonixDir]) {
      if (!url) continue
      const p = await readPackageJSON(pkg, { url }).catch(() => null)

      if (p) return p.version!
    }
    return ''
  }
  const harmonixVersion = await getPkgVersion('harmonix')

  logger.log(`${themeColor}Harmonix ${colors.bold(harmonixVersion)}\u001B[0m`)
}
