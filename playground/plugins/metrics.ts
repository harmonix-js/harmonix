import { definePlugin } from 'harmonix'

export default definePlugin('metrics', (harmonix) => {
  harmonix.hook('commands:sync:did', ({ result }) => {
    console.log(`[metrics] sending ${result.length}`)
  })
})
