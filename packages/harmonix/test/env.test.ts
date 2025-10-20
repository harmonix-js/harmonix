import { describe, it, expect } from 'vitest'

import { isEnvRef, resolveEnvRef } from '../src/config/env'

import type { EnvRef } from '../src/types/config'

const ref = (name: string, defaultValue?: string) =>
  ({ __hmx: 'env', name, default: defaultValue }) as EnvRef

describe('env', () => {
  it('isEnvRef should detects env references', () => {
    expect(isEnvRef(ref('TEST'))).toBe(true)
    expect(isEnvRef({})).toBe(false)
  })

  it('resolveEnvRef should resolve env references', () => {
    expect(resolveEnvRef(ref('FOO', 'bar'), { FOO: 'baz' })).toBe('baz')
    expect(resolveEnvRef(ref('FOO', 'bar'), { FOO: '' })).toBe('bar')
    expect(resolveEnvRef(ref('FOO'), {})).toBeUndefined()
  })
})
