import type {
  Client,
  Interaction,
  RESTPutAPIApplicationCommandsJSONBody,
  Snowflake,
  APIApplicationCommand
} from 'discord.js'
import type { Event } from '@parcel/watcher'

import type { Awaitable } from './utils'
import type { HarmonixDirs } from './config'
import type { ModuleType } from './module'

export interface HarmonixHooks {
  ready: (client: Client<true>) => Awaitable<void>
  'login:before': (client: Client) => Awaitable<void>
  'login:after': (client: Client) => Awaitable<void>

  'modules:dirs': (dirs: HarmonixDirs) => Awaitable<void>
  'modules:extend': (
    modules: { fullPath: string; path: string; type: ModuleType }[]
  ) => Awaitable<void>
  'modules:watch': (events: Event[]) => Awaitable<void>

  'commands:extend': (
    payload: RESTPutAPIApplicationCommandsJSONBody
  ) => Awaitable<void>
  'commands:sync:will': (data: {
    scope: 'guild' | 'global'
    guildId?: Snowflake
    payload: RESTPutAPIApplicationCommandsJSONBody
  }) => Awaitable<void>
  'commands:sync:did': (data: {
    scope: 'guild' | 'global'
    guildId?: Snowflake
    result: APIApplicationCommand[]
  }) => Awaitable<void>

  'interaction:before': (interaction: Interaction) => Awaitable<void>
  'interaction:after': (interaction: Interaction) => Awaitable<void>

  close: () => Awaitable<void>
}
