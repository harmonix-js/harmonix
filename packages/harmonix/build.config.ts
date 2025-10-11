import { defineBuildConfig } from 'unbuild'
import fs from 'node:fs/promises'

export default defineBuildConfig({
  name: 'harmonix',
  declaration: true,
  entries: [
    'src/index.ts',
    'src/types',
    {
      input: 'src/runtime/internal/config',
      outDir: 'dist/config',
      format: 'esm'
    }
  ],
  hooks: {
    async 'build:done'() {
      await fs.rm('dist/types.mjs')
    }
  }
})
