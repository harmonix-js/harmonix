import type { Harmonix } from '../harmonix'
import type { Awaitable } from '../utils'

export interface HarmonixPlugin {
  name?: string
  setup: (harmonix: Harmonix) => Awaitable<void>
}
