# Quick Start

## System Requirements

To get started with Harmonix, ensure your environment meets the following requirements:

- [Node.js v20.x](https://nodejs.org) or higher.
- A Discord application with a bot user (you can visit [Discord Developer Portal](https://discord.com/developers/applications)).

## Creating a new bot

In order to create a new Harmonix bot, you can use the [`create-harmonix`](https://www.npmjs.com/package/create-harmonix) CLI tool.

```bash [Terminal] icon=hugeicons:computer-terminal-01
pnpm create harmonix@latest
```

You will be prompted to provide configuration information.
Change directory to your newly created bot:

```bash
cd <bot-name>
```

Then, you can use the following command to add your bot into your Discord server:

```bash [Terminal] icon=hugeicons:computer-terminal-01
pnpm invite --id <app-id> -o
```

## Running in develoment mode

To run your bot in development mode, use the following command:

```bash [Terminal] icon=hugeicons:computer-terminal-01
pnpm dev
```

Edit the `commands/ping.ts` file and save it to see the changes reflected in real-time.

## Building for production

Once you are ready to ship your bot to production, you can build it using the following command:

```bash [Terminal] icon=hugeicons:computer-terminal-01
pnpm build
```

This will create a production-ready build of your bot in the `.output` directory.
