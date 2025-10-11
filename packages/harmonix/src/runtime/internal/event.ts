import { ModuleType } from '../../types/module'

import type { ClientEvents } from 'discord.js'

import type { HarmonixEventCallback } from '../../types/runtime/event'
import type { HarmonixEvent } from '../../types/module'

export const defineEvent = <T extends keyof ClientEvents>(
  name: T,
  callback: HarmonixEventCallback<T>
) => {
  return {
    type: ModuleType.Event,
    name,
    once: false,
    callback
  } as HarmonixEvent
}
