import { ButtonBuilder, ButtonStyle } from 'discord.js'

import type { HarmonixButtonComponent } from '../../types/module'

export const buildButtonComponent = (button: HarmonixButtonComponent) => {
  const builder = new ButtonBuilder()
    .setCustomId(button.customId)
    .setLabel(button.label)

  button.style && builder.setStyle(ButtonStyle[button.style])
  button.disabled && builder.setDisabled(button.disabled)
  button.emoji && builder.setEmoji(button.emoji)
  button.url && builder.setURL(button.url)
  button.skuId && builder.setSKUId(button.skuId)

  return builder
}
