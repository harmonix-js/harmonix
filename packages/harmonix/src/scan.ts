import { glob } from 'tinyglobby'
import { join, relative } from 'pathe'

import { ModuleType } from './types/module'

import type { Harmonix } from './types/harmonix'
import type { HarmonixDirs } from './types/config'

const GLOB_SCAN_PATTERN = '**/*.{js,mjs,cjs,ts,mts,cts}'

const getHarmonixDir = (type: ModuleType): keyof HarmonixDirs => {
  switch (type) {
    case ModuleType.Command: {
      return 'commands'
    }
    case ModuleType.Event: {
      return 'events'
    }
    case ModuleType.Component: {
      return 'components'
    }
  }
}

export const scanModule = async (harmonix: Harmonix, type: ModuleType) => {
  const baseDir = harmonix.options.dirs[getHarmonixDir(type)]
  const files = await scanDirs(harmonix, baseDir, type)

  return files
}

const scanDirs = async (harmonix: Harmonix, dir: string, type: ModuleType) => {
  const fileNames = await glob(GLOB_SCAN_PATTERN, {
    cwd: dir,
    dot: true,
    ignore: harmonix.options.ignore,
    absolute: true
  }).catch((error) => {
    if (error?.code === 'ENOTDIR') {
      harmonix.logger.warn(
        `Ignoring \`${join(dir, type)}\`. It must be a directory.`
      )

      return []
    }
    throw error
  })

  return fileNames
    .map((fullPath) => ({
      fullPath,
      path: relative(join(dir, type), fullPath),
      type
    }))
    .toSorted((a, b) => a.path.localeCompare(b.path))
}
