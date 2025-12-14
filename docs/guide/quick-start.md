# Quick Start

## System Requirements

To get started with Harmonix, ensure your environment meets the following requirements:

- [Node.js v20.x](https://nodejs.org) or higher.
- A Discord application with a bot user (you can visit [Discord Developer Portal](https://discord.com/developers/applications)).

## Creating a new bot

In order to create a new Harmonix bot, you can use the [`create-harmonix`](https://www.npmjs.com/package/create-harmonix) CLI tool.

```sh
pnpm create harmonix@latest
```

You will be prompted to provide configuration information.

```sh
✔  Where would you like to create your project? <my-bot>
✔  Which package manager would you like to use? npm / pnpm / yarn / deno
✔  Initialize a git repository? No / Yes

✨ Harmonix project has been created.
```

Change directory to your newly created bot:

```sh
cd <my-bot>
```

Add your bot token to the `.env` file:

```sh
DISCORD_TOKEN=<your-bot-token>
```

Open the `harmonix.config.ts` file and set your bot token:

```ts
import { defineConfig, env } from 'harmonix/config'

export default defineConfig({
  token: env('DISCORD_TOKEN'), // [!code ++]
  clientOptions: {
    intents: ['Guilds']
  }
})
```

Then, you can use the following command to add your bot into your Discord server:

```sh
pnpm invite -o
```

## Running in develoment mode

To run your bot in development mode, use the following command:

```sh
pnpm dev
```

Edit the `commands/ping.ts` file and save it to see the changes reflected in real-time.

## Building for production

Once you are ready to ship your bot to production, you can build it using the following command:

```sh
pnpm build
```

This will create a production-ready build of your bot in the `.output` directory.
