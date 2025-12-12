# Introduction

## What is Harmonix?

Harmonix is a TypeScript [open-source framework](https://github.com/harmonix-js/harmonix) for building Discord bots. It focuses on providing a clean, modular, and strongly-typed developer experience that makes creating, organizing, and scaling Discord bots effortless.

With Harmonix, you can define commands, events, and interactive components using a declarative and intuitive API, while benefiting from full type safety and auto-completion in your editor.

The framework handles the heavy lifting — such as command registration, option parsing, middleware execution, and interaction routing — allowing you to focus on building meaningful bot features instead of boilerplate.

## Why Harmonix?

Harmonix was built with a simple idea in mind: building Discord bots should feel as intuitive and productive as building modern web applications.
Instead of managing endless setup files, manual command registration, or fragile handler logic, Harmonix brings the power of modern framework patterns to Discord development — with clear conventions, strong typing, and modular architecture.

- **Developer Experience First** — every API in Harmonix is designed for clarity and speed of iteration. Autocomplete, rich typings, and intuitive helpers make development frictionless.

- **Minimal Configuration Setup** — start coding right away; Harmonix automatically detects commands, components, and events from your source files.

- **Full Type Safety** — powered by TypeScript generics and inference, every interaction (commands, options, subcommands) is strongly typed and context-aware.

- **Scalable Structure** — whether you’re building a small utility bot or a large modular application, Harmonix’s directory-based architecture grows with your project.

- **Inspired by Modern Frameworks** — Harmonix takes cues from frameworks like Next.js and Nuxt, bringing the same conventions (automatic routing, file-based modules, hot reload) to the Discord ecosystem.

- **Extendable at Every Level** — from middleware to command loaders, every part of Harmonix can be extended or overridden without breaking the convention system.

## How It Works?

When your bot starts, Harmonix scans your source directory, loads all defined modules (commands, events, and components), and builds an internal runtime graph that maps how each part of your bot interacts with Discord.

1. **Module Discovery**<br>
   Harmonix recursively scans your source directories (commands/, events/, components/) and automatically loads every file that exports a defined module (e.g., defineSlashCommand, defineEvent, etc.).

2. **Type Validation & Registration**<br>
   Each discovered module is type-checked and normalized. Slash commands, subcommands, and context menus are registered with Discord through the REST API, ensuring they’re always up to date.

3. **Runtime Binding**<br>
   Events and commands are bound to Discord’s event system, so interactions like slash commands, buttons, or modals are routed automatically to their matching handler.

4. **Middleware Pipeline Execution**<br>
   Before executing a handler, Harmonix runs your defined middleware chain — allowing you to apply permissions, context checks, or preprocessing logic in a unified way.

5. **Hot Reload & Sync**<br>
   When a file changes, Harmonix detects the modification, reloads only the affected module, and if necessary, re-syncs your bot’s command state with Discord — no manual redeploy or restart required

```txt
<srcDir>/
 ├─ commands/
 │   └─ ping.ts            → defineSlashCommand()
 ├─ events/
 │   └─ clientReady.ts     → defineEvent()
 └─ components/
     └─ button.ts          → defineButtonComponent()

```
