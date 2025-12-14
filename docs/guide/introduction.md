# Introduction

## What is Harmonix?

Harmonix is a TypeScript [open-source framework](https://github.com/harmonix-js/harmonix) for building Discord bots. It focuses on providing a clean, modular, and strongly-typed developer experience that makes creating, organizing, and scaling Discord bots effortless.

With Harmonix, you can define commands, events, and interactive components using a declarative and intuitive API, while benefiting from full type safety and auto-completion in your editor.

The framework handles the heavy lifting — such as command registration, option parsing, middleware execution, and interaction routing — allowing you to focus on building meaningful bot features instead of boilerplate.

## Why Harmonix?

Harmonix was built with a simple idea in mind: building Discord bots should feel as intuitive and productive as building modern web applications.
Instead of managing endless setup files, manual command registration, or fragile handler logic, Harmonix brings the power of modern framework patterns to Discord development — with clear conventions, strong typing, and modular architecture.

#### Key Features

- **🔷 TypeScript-First Development** — Full type safety with first-class TypeScript support and intelligent code completion
- **🧩 Modular Auto-Discovery** — Automatic discovery and registration of commands, events, and components
- **🎯 Built-in Context System** — Intuitive state management that makes handling data seamless
- **🔥 Hot Module Replacement** — Real-time code reloading without restarts for rapid development
- **🔌 Extensible Hook System** — Customize and extend bot behavior at runtime
- **✨ Developer Experience Focus** — Clean API with minimal boilerplate

### How It Works?

When your bot starts, Harmonix scans your source directory, loads all defined modules (commands, events, and components), and builds an internal runtime graph that maps how each part of your bot interacts with Discord.

1. **Module Discovery** — Harmonix recursively scans your source directories (`commands/`, `events/`, `components/`) and automatically loads every file that exports a defined module.

2. **Type Validation & Registration** — Each discovered module is type-checked and normalized. Slash commands, subcommands, and context menus are registered with Discord through the REST API.

3. **Runtime Binding** — Events and commands are bound to Discord's event system, so interactions are routed automatically to their matching handler.

4. **Middleware Pipeline Execution** — Before executing a handler, Harmonix runs your defined middleware chain for permissions, context checks, or preprocessing logic.

5. **Hot Reload & Sync** — When a file changes, Harmonix detects the modification, reloads only the affected module, and re-syncs your bot's command state with Discord.

```txt
<srcDir>/
 ├─ commands/
 │   └─ ping.ts            → defineSlashCommand()
 ├─ events/
 │   └─ clientReady.ts     → defineEvent()
 └─ components/
     └─ button.ts          → defineButtonComponent()

```
