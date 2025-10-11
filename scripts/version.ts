import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { x } from 'tinyexec'

async function version() {
  const preConfigPath = join(process.cwd(), '.changeset', 'pre.json')

  if (existsSync(preConfigPath)) {
    const { mode } = JSON.parse(await readFile(preConfigPath, 'utf8'))

    if (mode !== 'exit') {
      await x('pnpm', ['changeset', 'pre', 'exit'])
    }
  }
  const releaseType = process.env.RELEASE_TYPE

  switch (releaseType) {
    case 'beta':
    case 'rc': {
      await x('pnpm', ['changeset', 'pre', 'enter', releaseType])
      break
    }
    case 'stable': {
      break
    }
    default: {
      throw new Error(
        `Invalid release type: ${releaseType}. Must be one of: beta, rc, stable`
      )
    }
  }

  await x('pnpm', ['changeset', 'version'])
}

await version()
