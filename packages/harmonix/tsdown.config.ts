import { defineConfig } from 'tsdown'

export default defineConfig({
  name: 'harmonix',
  entry: {
    index: './src/index.ts',
    types: './src/types/index.ts',
    config: './src/runtime/internal/config.ts'
  },
  fixedExtension: true
})
