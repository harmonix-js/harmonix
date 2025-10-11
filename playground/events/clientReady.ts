import { defineEvent } from 'harmonix'

export default defineEvent('clientReady', (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})
