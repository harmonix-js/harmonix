# Commands

## Defining Slash Commands

Create a slash command by exporting `defineSlashCommand` from a file in the `commands/` directory:

```typescript [commands/ping.ts]
import { defineSlashCommand } from 'harmonix'

export default defineSlashCommand(
  {
    description: 'Replies with Pong!'
  },
  async (interaction) => {
    await interaction.reply('Pong!')
  }
)
```

## Command Options

Add options to your commands with full type safety:

```typescript [commands/moderation/ban.ts]
import { defineSlashCommand } from 'harmonix'

export default defineSlashCommand(
  {
    description: 'Select a member and ban them.',
    options: {
      target: {
        type: 'User',
        description: 'The member to ban',
        required: true
      },
      reason: {
        type: 'String',
        description: 'The reason for banning'
      }
    }
  },
  async (interaction, options) => {
    const reason = options.reason ?? 'No reason provided'

    await interaction.reply(
      `Banning ${options.target.username} for reason: ${reason}`
    )
    await interaction.guild.members.ban(options.target)
  }
)
```

## Subcommands

Organize related commands using subcommands with `defineSlashSubcommand`:

```typescript [commands/utility/info.ts]
import { defineSlashCommand, defineSlashSubcommand } from 'harmonix'

const user = defineSlashSubcommand(
  {
    description: 'Info about a user',
    options: {
      target: {
        type: 'User',
        description: 'The user'
      }
    }
  },
  async (interaction, options) => {
    await interaction.reply(`👤 ${options.target?.username ?? interaction.user.username}`)
  }
)

const server = defineSlashSubcommand(
  { description: 'Info about the server' },
  async (interaction) => {
    await interaction.reply(`🏠 ${interaction.guild?.name}`)
  }
)
export default defineSlashCommand(
  {
    description: 'Get info about a user or a server!'
    subcommands: { user, server }
  }
)
```

## Context Menu Commands

Create context menu commands that appear when right-clicking users or messages. There are two types:

### User Context Menu

```typescript [commands/userinfo.ts]
import { defineUserContextMenuCommand } from 'harmonix'

export default defineUserContextMenuCommand(
  {
    name: 'User Information'
  },
  async (interaction, target) => {
    await interaction.reply(`👤 User: ${target.username}`)
  }
)
```

### Message Context Menu

```typescript [commands/messageinfo.ts]
import { defineMessageContextMenuCommand } from 'harmonix'

export default defineMessageContextMenuCommand(
  {
    name: 'Message Information'
  },
  async (interaction, target) => {
    await interaction.reply(`💬 Message: ${target.content}`)
  }
)
```
