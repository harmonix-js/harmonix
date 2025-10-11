import { pathToFileURL } from 'node:url'
import { resolveModulePath } from 'exsolve'

export const tryResolveHarmonix = (rootDir: string) => {
  for (const pkg of ['harmonix']) {
    const path = resolveModulePath(pkg, { from: rootDir, try: true })

    if (path) return path
  }

  return null
}

export const loadHarmonix = async (
  rootDir: string
): Promise<typeof import('harmonix')> => {
  try {
    const entry = resolveModulePath('harmonix', {
      from: tryResolveHarmonix(rootDir) || rootDir
    })

    return await import(pathToFileURL(entry).href)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
