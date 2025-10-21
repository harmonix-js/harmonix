import { describe, expect, it } from 'vitest'

import { resolveHarmonixPath } from '../src/utils/fs'

describe('fs', () => {
  it('resolveHarmonixPath should replace template params', () => {
    const opts: any = { srcDir: '/tmp/project/src', dirs: { commands: 'cmds' } }

    const basePath = resolveHarmonixPath('{{ dirs.commands }}', opts, '/base')
    const srcPath = resolveHarmonixPath('{{ dirs.commands }}', opts)

    expect(basePath).toBe('/base/cmds')
    expect(srcPath).toBe('/tmp/project/src/cmds')
  })
})
