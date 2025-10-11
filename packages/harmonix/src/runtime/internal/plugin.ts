import type { HarmonixPlugin } from '../../types/runtime/plugin'

export function definePlugin(setup: HarmonixPlugin['setup']): HarmonixPlugin
export function definePlugin(
  name: string,
  setup: HarmonixPlugin['setup']
): HarmonixPlugin

export function definePlugin(
  nameOrSetup: string | HarmonixPlugin['setup'],
  maybeSetup?: HarmonixPlugin['setup']
): HarmonixPlugin {
  const name = typeof nameOrSetup === 'string' ? nameOrSetup : undefined
  const setup = typeof nameOrSetup === 'function' ? nameOrSetup : maybeSetup

  if (typeof setup !== 'function') {
    throw new TypeError('definePlugin: setup function is required')
  }

  return Object.freeze({ name, setup })
}
