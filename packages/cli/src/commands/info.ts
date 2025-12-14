import os from 'node:os'
import { defineCommand } from 'citty'
import clipboardy from 'clipboardy'
import { splitByCase } from 'scule'
import { resolve } from 'pathe'
import { readPackageJSON } from 'pkg-types'
import { detectPackageManager } from 'nypm'
import { isMinimal } from 'std-env'

import { rootDirArgs } from './_shared'
import { tryResolveHarmonix } from '../utils/kit'
import { getPackageManagerVersion } from '../utils/packageManager'
import { version as cliVersion } from '../../package.json'
import { logger } from '../utils/logger'

import type { PackageJson } from 'pkg-types'

import type { HarmonixConfig } from '../../../harmonix/src/types/config'

export default defineCommand({
  meta: {
    name: 'info',
    description: 'Get information about Harmonix project'
  },
  args: {
    ...rootDirArgs
  },
  async run({ args }) {
    const cwd = resolve(args.cwd || args.rootDir)
    const harmonixConfig = await getHarmonixConfig(cwd)
    const { dependencies = {}, devDependencies = {} } = await readPackageJSON(
      cwd
    ).catch(() => ({}) as PackageJson)
    const harmonixPath = tryResolveHarmonix(cwd)
    const getDepVersion = async (name: string) => {
      for (const url of [cwd, harmonixPath]) {
        if (!url) continue
        const pkg = await readPackageJSON(name, { url }).catch(() => null)

        if (pkg) return pkg.version
      }

      return dependencies[name] || devDependencies[name]
    }

    const harmonixVersion = await getDepVersion('harmonix')

    let packageManager = (await detectPackageManager(cwd))?.name
    if (packageManager) {
      packageManager += `@${getPackageManagerVersion(packageManager)}`
    }

    const info = {
      OperatingSystem: os.type(),
      NodeVersion: process.version,
      HarmonixVersion: harmonixVersion,
      CLIVersion: cliVersion,
      PackageManager: packageManager ?? 'unknown',
      UserConfig: Object.keys(harmonixConfig)
        .map((key) => `\`${key}\``)
        .join(', ')
    }

    logger.log('Working directory:', cwd)

    const entries = Object.entries(info).map(([key, val]) => [
      splitByCase(key).join(' '),
      val?.includes('`') ? val : `\`${val}\``
    ])
    const maxLength = Math.max(...entries.map(([label]) => label?.length || 0))
    const infoStr = entries
      .map(([label, value]) => `- ${`${label}:`.padEnd(maxLength + 2)}${value}`)
      .join('\n')

    const copied =
      !isMinimal &&
      (await clipboardy
        .write(infoStr)
        .then(() => true)
        .catch(() => false))

    const log = [
      '👉 Report an issue: https://github.com/harmonix-js/harmonix/issues/new?template=bug-report.yml',
      '👉 Suggest an improvement: https://github.com/harmonix-js/harmonix/discussions/new',
      '👉 Read documentation: https://harmonixjs.org'
    ].join('\n')

    const splitter = '------------------------------'

    logger.log(
      `Harmonix project info: ${copied ? '(copied to clipboard)' : ''}\n\n${splitter}\n${infoStr}\n${splitter}\n\n${log}\n`
    )
  }
})

const getHarmonixConfig = async (rootDir: string) => {
  try {
    const { createJiti } = await import('jiti')
    const jiti = createJiti(rootDir, {
      interopDefault: true,
      alias: {
        '~': rootDir,
        '@': rootDir
      }
    })
    ;(globalThis as any).defineConfig = (c: any) => c
    const result = (await jiti.import('./harmonix.config', {
      default: true
    })) as HarmonixConfig
    delete (globalThis as any).defineConfig
    return result
  } catch {
    return {}
  }
}
