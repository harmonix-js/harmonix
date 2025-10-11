import type { EnvRef } from '../types/config'

export const isEnvRef = (v: any): v is EnvRef => {
  return (
    v &&
    typeof v === 'object' &&
    v.__hmx === 'env' &&
    typeof v.name === 'string'
  )
}

export const resolveEnvRef = (
  ref: EnvRef,
  env: Record<string, string | undefined> = process.env
) => {
  const value = env[ref.name]

  if (value != null && String(value).trim() !== '') {
    return value
  }

  return ref.default
}
