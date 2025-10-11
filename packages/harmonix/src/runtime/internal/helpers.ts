import { ActionRowBuilder } from 'discord.js'

import type { MessageActionRowComponentBuilder } from 'discord.js'

export const createActionRow = (
  ...components: MessageActionRowComponentBuilder[]
) => {
  const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()

  for (const component of components) {
    row.addComponents(component)
  }

  return row
}
