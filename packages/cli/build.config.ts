import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: ['./src/index', './src/runtime/harmonix'],
  externals: ['harmonix', 'discord.js', /^#harmonix-virtual\//]
})
