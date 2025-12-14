import { ModuleType } from '../../types/module'

import type { ClientEvents } from 'discord.js'

import type { HarmonixEventCallback } from '../../types/runtime/event'
import type { HarmonixEvent } from '../../types/module'

export function defineEvent<T extends keyof ClientEvents>(
  config: { name: T; once?: boolean },
  callback: HarmonixEventCallback<T>
): HarmonixEvent

export function defineEvent<T extends keyof ClientEvents>(
  name: T,
  callback: HarmonixEventCallback<T>
): HarmonixEvent

export function defineEvent<T extends keyof ClientEvents>(
  nameOrConfig: T | { name: T; once?: boolean },
  callback: HarmonixEventCallback<T>
) {
  const name =
    typeof nameOrConfig === 'string' ? nameOrConfig : nameOrConfig.name
  const once =
    typeof nameOrConfig === 'string' ? false : (nameOrConfig.once ?? false)

  return {
    type: ModuleType.Event,
    name,
    once,
    callback
  } as HarmonixEvent
}
