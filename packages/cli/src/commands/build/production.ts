import { colors } from 'consola/utils'
import { relative } from 'pathe'
import { rollup } from 'rollup'

import { generateFSTree } from '../../utils/fs-tree'

import type { Harmonix } from 'harmonix/types'
import type { OutputOptions, RollupOptions } from 'rollup'

export const buildProduction = async (
  harmonix: Harmonix,
  config: RollupOptions
) => {
  const bundle = await rollup(config)

  harmonix.logger.info(
    `Building Harmonix bot in \`${prettyPath(harmonix.options.outDir)}\``
  )

  await bundle.write(config.output as OutputOptions)

  if (harmonix.options.logging.buildSuccess) {
    harmonix.logger.success('Harmonix bot built')
  }
  if (harmonix.options.logLevel > 1) {
    process.stdout.write(
      (await generateFSTree(harmonix.options.outDir, {
        compressedSizes: harmonix.options.logging.compressedSizes
      })) || ''
    )
  }

  const rOutput = relative(process.cwd(), harmonix.options.outDir)
  const rewriteRelativePaths = (input: string) => {
    return input.replace(/([\s:])\.\/(\S*)/g, `$1${rOutput}/$2`)
  }

  harmonix.logger.success(
    `You can deploy this build using \`${rewriteRelativePaths('node ./index.mjs')}\``
  )

  await bundle.close()
}

const prettyPath = (path: string) => {
  path = relative(process.cwd(), path)

  return colors.cyan(path)
}
