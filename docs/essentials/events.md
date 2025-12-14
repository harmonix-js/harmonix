# Events

## Defining Events

Handle Discord.js events by defining event handlers:

```typescript
// events/ready.ts
export default defineEvent('ready', (client) => {
  console.log(`✅ Logged in as ${client.user.tag}`)
})
```

## Event with Options

Configure event behavior:

```typescript
// events/messageCreate.ts
export default defineEvent(
  {
    name: 'messageCreate',
    once: false
  },
  async (message) => {
    if (message.author.bot) return

    if (message.content.startsWith('!ping')) {
      await message.reply('Pong!')
    }
  }
)
```

## Common Events

Here are commonly used events:

```typescript
// events/guildMemberAdd.ts
export default defineEvent('guildMemberAdd', async (member) => {
  const channel = member.guild.systemChannel
  if (channel) {
    await channel.send(`Welcome ${member.user.tag} to the server! 🎉`)
  }
})
```
