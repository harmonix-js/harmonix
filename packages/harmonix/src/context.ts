import { getContext } from 'unctx'

import type { Harmonix } from './types/harmonix'

const harmonixCtx = getContext<Harmonix<true>>('harmonix')

export const useHarmonix = () => {
  const instance = harmonixCtx.tryUse()

  if (!instance) {
    throw new Error('Harmonix instance is unavailable.')
  }

  return instance
}

export const runWithHarmonixContext = <T>(harmonix: Harmonix, fn: () => T) => {
  return harmonixCtx.call(harmonix as Harmonix<true>, fn)
}
