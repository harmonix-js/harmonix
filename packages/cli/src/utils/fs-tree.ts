import fsp from 'node:fs/promises'
import { colors } from 'consola/utils'
import { gzipSize } from 'gzip-size'
import { dirname, relative, resolve } from 'pathe'
import prettyBytes from 'pretty-bytes'
import { isTest } from 'std-env'
import { glob } from 'tinyglobby'

import { runParallel } from './parallel'

export const generateFSTree = async (
  dir: string,
  options: { compressedSizes?: boolean } = {}
) => {
  if (isTest) return ''

  const files = await glob('**/*.*', { cwd: dir, ignore: ['*.map'] })
  const items: { file: string; path: string; size: number; gzip: number }[] = []

  await runParallel(
    new Set(files),
    async (file) => {
      const path = resolve(dir, file)
      const src = await fsp.readFile(path)
      const size = src.byteLength
      const gzip = options.compressedSizes ? await gzipSize(src) : 0

      items.push({ file, path, size, gzip })
    },
    { concurrency: 10 }
  )

  items.sort((a, b) => a.path.localeCompare(b.path))

  let totalSize = 0
  let totalGzip = 0
  let totalNodeModulesSize = 0
  let totalNodeModulesGzip = 0

  const lines: string[] = []

  for (const [index, item] of items.entries()) {
    const isNodeModules = item.file.includes('node_modules')

    if (isNodeModules) {
      totalNodeModulesSize += item.size
      totalNodeModulesGzip += item.gzip
      continue
    }

    const rpath = relative(process.cwd(), item.path)
    const treeChar = index === items.length - 1 ? '└─' : '├─'
    const sizeTxt = ` (${prettyBytes(item.size)})`
    const gzipTxt = options.compressedSizes
      ? ` (${prettyBytes(item.gzip)} gzip)`
      : ''

    lines.push(colors.gray(`  ${treeChar} ${rpath}${sizeTxt}${gzipTxt}`))

    totalSize += item.size
    totalGzip += item.gzip
  }

  const totalLineBase = `${colors.cyan('Σ Total size:')} ${prettyBytes(
    totalSize + totalNodeModulesSize
  )}`
  const totalLine = options.compressedSizes
    ? `${totalLineBase}  (${prettyBytes(totalGzip + totalNodeModulesGzip)} gzip)`
    : totalLineBase

  lines.push(totalLine + '\n')

  return lines.join('\n')
}
