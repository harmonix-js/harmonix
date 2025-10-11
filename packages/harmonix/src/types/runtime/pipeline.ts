import type { CommandInteraction } from 'discord.js'

import type { Awaitable } from '../utils'

export type Middleware = (
  interaction: CommandInteraction,
  next: () => Promise<void>
) => Promise<void>

export type GuardFn = (
  interaction: CommandInteraction
) => Awaitable<boolean | void>
