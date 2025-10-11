import type { EnvRef, HarmonixConfig } from '../../types/config'

export const defineConfig = (config: Omit<HarmonixConfig, 'rootDir'>) => config

export const env = (
  name: string,
  opts?: { required?: boolean; default?: string }
): EnvRef => {
  return { __hmx: 'env', name, ...opts }
}
