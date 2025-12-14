# Core Concepts

## Project Structure

Harmonix uses a convention-based file structure that automatically discovers and registers your bot's functionality:

```
my-bot/
├─ commands/          # Slash commands and subcommands
│  ├─ ping.ts
│  ├─ moderation/
│  │  ├─ ban.ts
│  │  └─ kick.ts
│  └─ info/
│     └─ user.ts
├─ events/            # Discord client events
│  ├─ ready.ts
│  └─ messageCreate.ts
├─ components/        # Interactive components
│  ├─ buttons/
│  │  └─ verify.ts
│  └─ modals/
│     └─ feedback.ts
├─ middleware/        # Command middleware
│  └─ auth.ts
├─ .env                  # Environment variables
├─ harmonix.config.ts    # Framework configuration
└─ package.json
```

## Module Types

Harmonix supports several module types, each serving a specific purpose:

- **Slash Commands** — Standard Discord slash commands
- **Context Menu Commands** — Right-click commands on users/messages
- **Events** — Discord.js client event handlers
- **Button Components** — Interactive button handlers
- **Select Menu Components** — Dropdown menu handlers
- **Modal Components** — Form submission handlers
