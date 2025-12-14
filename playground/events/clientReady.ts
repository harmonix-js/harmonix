import { defineEvent } from 'harmonix'

export default defineEvent({ name: 'clientReady', once: true }, (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})
