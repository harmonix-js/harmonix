import type { Hookable } from 'hookable'
import type { Client, Collection } from 'discord.js'
import type { ConsolaInstance } from 'consola'

import type { HarmonixOptions } from './config'
import type { HarmonixHooks } from './hooks'
import type {
  HarmonixCommand,
  HarmonixComponent,
  HarmonixEvent
} from './module'

export interface Harmonix<Ready extends boolean = boolean> {
  options: HarmonixOptions
  logger: ConsolaInstance
  hooks: Hookable<HarmonixHooks>
  callHook: Hookable<HarmonixHooks>['callHook']
  hook: Hookable<HarmonixHooks>['hook']

  client: Client<Ready>

  commands: Collection<string, HarmonixCommand>
  events: Collection<string, HarmonixEvent>
  components: Collection<string, HarmonixComponent>

  close: () => Promise<void>
}
