---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Harmonix'
  text: 'From Discord to Harmonix'
  tagline: The DX-first framework for Discord bots.
  image:
    dark: /logo.svg
    light: /logo.svg
    alt: Harmonix Logo
  actions:
    - theme: brand
      text: What is Harmonix?
      link: /guide/introduction
    - theme: alt
      text: Quickstart
      link: /guide/getting-started
    - theme: alt
      text: CLI
      link: /cli/installation

features:
  - title: TypeScript-First Development
    icon: ⚡
    details: Fully type-safe framework with first-class TypeScript support, providing complete type safety and intelligent code completion throughout your bot development.
  - title: Modular Auto-Discovery
    icon: 🧩
    details: Automatic discovery and registration of commands, events, and other components, eliminating manual setup and reducing boilerplate code.
  - title: Built-in Context System
    icon: 🎯
    details: Intuitive state management through a built-in context system that makes handling data and state across your bot seamless and organized.
  - title: Hot Module Replacement (HMR)
    icon: 🔥
    details: Real-time code reloading during development that updates your bot instantly without restarts, dramatically speeding up the development workflow.
  - title: Extensible Hook System
    icon: 🔌
    details: Powerful hook system that allows you to customize and extend bot behavior at runtime, giving you fine-grained control over execution flow.
  - title: Developer Experience Focus
    icon: ✨
    details: Clean, intuitive API design with minimal boilerplate that lets you write commands naturally and focus on features rather than framework complexity.
---
