import process from 'node:process'
import { runCommand as _runCommand, runMain as _runMain } from 'citty'

import init from '../../cli/src/commands/init'
import { main } from './main'

export const runMain = () => _runMain(main)

export const runCommand = async (
  name: 'init',
  argv: string[] = process.argv.slice(2),
  data: { overrides?: Record<string, any> } = {}
) => {
  return await _runCommand(init, {
    rawArgs: argv,
    data: {
      overrides: data.overrides || {}
    }
  })
}
