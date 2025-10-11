import type { ClientEvents } from 'discord.js'

import type { Awaitable } from '../utils'

export interface HarmonixEventCallback<K extends keyof ClientEvents> {
  (...args: ClientEvents[K]): Awaitable<void>
}
