import { defineCommand } from 'citty'
import { commands } from './commands'
import { name, version, description } from '../package.json'

export const main = defineCommand({
  meta: {
    name,
    version,
    description
  },
  subCommands: commands
})
