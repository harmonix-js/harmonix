import { defineSlashCommand, defineSlashSubcommand } from 'harmonix'

const user = defineSlashSubcommand(
  {
    description: 'Get info about a user',
    options: {
      target: {
        type: 'User',
        description: 'The user to get info about',
        required: false
      }
    }
  },
  async (i, opts) => {
    const user = opts.target ?? i.user
    await i.reply(`👤 ${user.username}`)
  }
)

const server = defineSlashSubcommand(
  { description: 'Get info about this server' },
  async (i) => {
    await i.reply(`🏠 ${i.guild?.name}`)
  }
)

export default defineSlashCommand({
  description: 'Get information about something',
  subcommands: { user, server }
})
