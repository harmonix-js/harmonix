import { defineCommand } from 'citty'

import { name, version, description } from '../package.json'
import init from '../../cli/src/commands/init'

export const main = defineCommand({
  meta: {
    name,
    version,
    description
  },
  args: init.args,
  setup: async (ctx) => {
    await init.run?.(ctx)
  }
})
