import { describe, it, expect } from 'vitest'

import { toArray, valuesOf } from '../src/utils/helpers'

describe('helpers', () => {
  it('toArray should wraps a single value in an array', () => {
    expect(toArray(1)).toEqual([1])
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('valuesOf should return the values of an object', () => {
    expect(valuesOf({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3])
    expect(valuesOf({})).toEqual([])
  })
})
