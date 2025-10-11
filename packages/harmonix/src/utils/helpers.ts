import type { OneOrMany } from '../types/utils'

export const toArray = <T>(value: OneOrMany<T>) =>
  Array.isArray(value) ? value : [value]

export const valuesOf = <T extends Record<string, any>>(
  obj: T
): readonly T[keyof T][] => {
  const keys = Object.keys(obj) as (keyof T)[]

  return keys.map((key) => obj[key])
}
