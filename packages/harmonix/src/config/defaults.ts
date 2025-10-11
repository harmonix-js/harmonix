import type { HarmonixConfig } from '../types/config'

export const HarmonixDefaults: HarmonixConfig = {
  outDir: '{{ rootDir }}/.output',
  dirs: {
    commands: 'commands',
    events: 'events',
    components: 'components'
  },

  categorization: {
    inferFromPath: true,
    categories: {}
  },
  plugins: [],

  logLevel: 3,
  ignore: [],

  dev: false,

  logging: {
    compressedSizes: true,
    buildSuccess: true
  },

  sourceMap: true
}
