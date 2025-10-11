import { createMiddleware, defineSlashCommand } from 'harmonix'

const withLogging = createMiddleware(async (interaction, next) => {
  const t0 = Date.now()

  try {
    await next()
  } finally {
    console.log(
      `command ${interaction.commandName} finished in ${Date.now() - t0}ms`
    )
  }
})

export default defineSlashCommand(
  {
    description: 'Ping command',
    options: {
      channel: {
        type: 'Channel',
        description: 'The channel to ping',
        channelTypes: 'GuildText'
      },
      ping: {
        type: 'String',
        description: 'The ping message',
        autocomplete: true
      }
    },
    middleware: [withLogging]
  },
  async (interaction, { channel }) => {
    if (channel && channel.isSendable()) {
      await channel.send('Pong! 🏓')
      interaction.reply({
        content: `Pong! Message sent to ${channel}`,
        flags: 'Ephemeral'
      })
    } else {
      interaction.reply('Pong! 🏓')
    }
  }
)
