import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    dts: {
      respectExternal: false
    },
    inlineDependencies: true,
    resolve: {
      exportConditions: ['production', 'node']
    }
  },
  entries: ['./src/index'],
  externals: [
    'node:url',
    'node:buffer',
    'node:path',
    'node:child_process',
    'node:process',
    'node:path',
    'node:os'
  ]
})
