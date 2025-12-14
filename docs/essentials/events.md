# Events

## Defining Events

Handle Discord.js events by defining event handlers:

```typescript
// events/ready.ts
import { defineEvent } from 'harmonix'

export default defineEvent('ready', (client) => {
  console.log(`✅ Logged in as ${client.user.tag}`)
})
```

## Event with Options

Configure event behavior:

```typescript
// events/clientReady.ts
import { defineEvent } from 'harmonix'

export default defineEvent(
  {
    name: 'clientReady',
    once: true
  },
  async (client) => {
    console.log(`✅ Logged in as ${client.user.tag}`)
  }
)
```

## Common Events

Here are commonly used events:

```typescript
// events/guildMemberAdd.ts
import { defineEvent } from 'harmonix'

export default defineEvent('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel
  if (channel) {
    await channel.send(`Welcome ${member.user.tag} to the server! 🎉`)
  }
})
```
