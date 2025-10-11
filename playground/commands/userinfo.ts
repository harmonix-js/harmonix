import { createGuard, defineUserContextMenuCommand } from 'harmonix'

export const ownerOnly = createGuard((interaction) => {
  if (interaction.user.id !== process.env.OWNER_ID) {
    interaction.reply({
      content: 'Only the bot owner can use this command.',
      flags: 'Ephemeral'
    })

    return false
  }
})

export default defineUserContextMenuCommand(
  {
    name: 'User Info',
    middleware: [ownerOnly]
  },
  (interaction) => {
    interaction.reply(`👤 User: ${interaction.targetUser.username}`)
    throw new Error('This command is not implemented yet.')
  }
)
