import { runWithHarmonixContext } from '../../context'

import type { Harmonix } from '../../types/harmonix'
import type { HarmonixEvent } from '../../types/module'

export const eventHandlers = new Map<string, (...args: any) => void>()

export const handleEvent = (
  harmonix: Harmonix,
  event: HarmonixEvent,
  filePath: string
) => {
  const existing = eventHandlers.get(filePath)

  if (existing) {
    harmonix.client.removeListener(event.name, existing)
  }
  const handler = (...args: any) =>
    runWithHarmonixContext(harmonix, () => event.callback(...args))

  eventHandlers.set(filePath, handler)
  const method = event.once ? 'once' : 'on'

  harmonix.client[method](event.name, handler)
}
