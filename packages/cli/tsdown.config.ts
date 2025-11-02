import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/runtime/harmonix.ts'],
  external: ['harmonix', 'discord.js', /^#harmonix-virtual\//],
  fixedExtension: true
})
