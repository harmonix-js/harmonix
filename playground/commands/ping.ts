import { defineSlashCommand } from 'harmonix'

export default defineSlashCommand(
  { description: 'Ping command' },
  async (interaction) => {
    await interaction.reply('Pong! 🏓')
  }
)
