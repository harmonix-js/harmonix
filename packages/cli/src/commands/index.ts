import type { CommandDef } from 'citty'

const _default = (r: any) => (r.default || r) as Promise<CommandDef>

export const commands = {
  init: () => import('./init').then(_default),
  dev: () => import('./dev').then(_default),
  build: () => import('./build').then(_default),
  upgrade: () => import('./upgrade').then(_default),
  invite: () => import('./invite').then(_default),
  info: () => import('./info').then(_default),
  cleanup: () => import('./cleanup').then(_default)
} as const
