import type { ArgDef } from 'citty'

export const cwdArgs = {
  cwd: {
    type: 'string',
    description: 'Specify the working directory',
    valueHint: 'directory',
    default: '.'
  }
} as const satisfies Record<string, ArgDef>

export const rootDirArgs = {
  cwd: {
    ...cwdArgs.cwd,
    description:
      'Specify the working directory, this takes precedence over ROOTDIR (default: `.`)',
    default: undefined
  },
  rootDir: {
    type: 'positional',
    description: 'Specify the working directory (default: `.`)',
    required: false,
    default: '.'
  }
} as const satisfies Record<string, ArgDef>
