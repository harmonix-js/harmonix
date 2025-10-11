import { defineConfig, env } from 'harmonix/config'
import metrics from './plugins/metrics'

export default defineConfig({
  token: env('DISCORD_TOKEN'),
  clientOptions: {
    intents: ['Guilds']
  },
  plugins: [metrics]
})
