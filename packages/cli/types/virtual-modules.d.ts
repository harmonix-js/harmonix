declare module '#harmonix-virtual/modules' {
  export type HarmonixModuleKind = 'command' | 'event' | 'component'
  export type HarmonixVirtualItem = {
    kind: HarmonixModuleKind
    path: string
    load: () => Promise<any>
  }
  export const modules: HarmonixVirtualItem[]
}

declare module '#harmonix-virtual/config' {
  export const __INLINE_CONFIG__: {
    clientOptions?: any
    logLevel?: number
    token?:
      | { __hmx: 'env'; name: string; required?: boolean; default?: string }
      | string
  }
}
