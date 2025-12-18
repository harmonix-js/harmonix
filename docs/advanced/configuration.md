# Configuration

## Basic Configuration

Configure Harmonix using `harmonix.config.ts`:

```typescript [harmonix.config.ts]
import { defineConfig, env } from 'harmonix'

export default defineConfig({
  // Bot token
  token: env('DISCORD_TOKEN'),

  // Discord client options
  client: {
    intents: ['Guilds', 'GuildMessages', 'MessageContent']
  }
})
```

> [!NOTE]
> You can use `process.env.VARIABLE_NAME`, but it's recommended to use the `env` function for build safety.

## Environment Variables

Use environment variables for sensitive data:

```
DISCORD_TOKEN=<your-bot-token>
```

## Client Intents

Configure required Discord intents:

```typescript
export default defineConfig({
  client: {
    intents: [
      'Guilds',
      'GuildMembers',
      'GuildMessages',
      'MessageContent',
      'GuildVoiceStates'
    ]
  }
})
```
