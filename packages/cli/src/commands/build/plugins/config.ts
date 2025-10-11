import { uneval } from 'devalue'
import { virtual } from './virtual'

import type { HarmonixOptions } from 'harmonix/types'

export const config = (options: HarmonixOptions) => {
  const { clientOptions, logLevel, token } = options

  return virtual({
    '#harmonix-virtual/config':
      () => `export const _inlineConfig = ${uneval({ clientOptions, logLevel, token })};

globalThis.__HARMONIX_CONFIG__ = _inlineConfig;
export const __INLINE_CONFIG__ = _inlineConfig;
`
  })
}
