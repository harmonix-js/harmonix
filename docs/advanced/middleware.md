# Middleware

## Creating Middleware

Middleware allows you to run code before command execution:

```typescript [middleware/logging.ts]
export const logging = createMiddleware(async (interaction, next) => {
  const startTime = Date.now()

  console.log(`[${interaction.commandName}] Started by ${interaction.user.tag}`)

  // Execute the command
  await next()

  // Code after command execution
  const duration = Date.now() - startTime

  console.log(`[${interaction.commandName}] Completed in ${duration}ms`)
})
```

## Applying Middleware

Apply middleware to specific commands:

```typescript [commands/ping.ts]
import { defineSlashCommand } from 'harmonix'
import { logging } from '../middleware/logging' // [!code ++]

export default defineSlashCommand(
  {
    description: 'Replies with Pong!',
    middleware: [logging] // [!code ++]
  },
  async (interaction) => {
    await interaction.reply('Pong!')
  }
)
```
