<div align="center">

![Harmonix Banner](./.github/assets/harmonix-banner.svg)

# Harmonix

### The DX-first framework for Discord bots.

[![npm version](https://img.shields.io/npm/v/harmonix/beta?style=flat&colorA=030712&colorB=4b43ee)](https://www.npmjs.com/package/harmonix)
[![npm downloads](https://img.shields.io/npm/dm/harmonix?style=flat&colorA=030712&colorB=4b43ee)](https://npm.chart.dev/harmonix)
[![license](https://img.shields.io/github/license/harmonix-js/core?style=flat&colorA=030712&colorB=4b43ee)](https://github.com/harmonix-js/harmonix/blob/main/LICENSE)

[![discord](https://img.shields.io/discord/1237898486167633921?logo=discord&logoColor=white&style=flat&colorA=030712&colorB=4b43ee)](https://discord.gg/TE8F6BgteQ)

</div>

## 🧭 Overview

Harmonix is a modern, TypeScript-first framework designed to help you build powerful, scalable, and maintainable Discord bots. With a strong focus on developer experience, it simplifies your workflow so you can spend less time on boilerplate and more time crafting engaging bot features.

Its modular design, type-safety, and built-in development tools make it a solid foundation whether you're prototyping a small project or building a feature-rich application across multiple servers.

It provides a number of powerful features that make it easier to develop fast, reliable, and context-aware Discord bots, including:

- 🧠 Fully type-safe with first-class TypeScript support
- 🧩 Modular design with auto-discovery of commands, events and more
- 🎯 Built-in context system for intuitive state management
- 🔁 Built-in HMR (Hot Module Replacement) for a seamless dev experience
- 🔌 Hook system to customize and extend behavior at runtime
- 🧰 Developer-first API and DX-focused architecture

### 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [🚀 Getting Started](#-getting-started)
- [🤖 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📄 License & Credits](#-license--credits)

</details>

## 🚀 Getting Started

Use the following command to scaffold a starter template with all the necessary files and dependencies:

```bash
pnpm create harmonix@latest <my-bot>
```

## 🤖 Development

Harmonix offers a straightforward, user-friendly, and robust solution for writing commands naturally. It automates all repetitive tasks, allowing you to concentrate on developing your bot features.

Example of a `commands/ping.ts`:

```ts
export default defineSlashCommand(
  { description: 'Ping the bot' },
  (interaction) => {
    interaction.reply('Pong!')
  }
)
```

## 🤝 Contributing

Harmonix is an open-source framework and like any great open-source project, it thrives on community contributions.

Whether you're fixing a bug, improving the documentation, suggesting ideas, or building something new, your input matters.

Check out our [Contributing Guide](./CONTRIBUTING.md) to get started.

## 📄 License & Credits

Published under the [MIT](./LICENSE) license.
