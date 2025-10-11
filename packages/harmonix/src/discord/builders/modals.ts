import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

import type { HarmonixModalComponent } from '../../types/module'

export const buildModalComponent = (modal: HarmonixModalComponent) => {
  const builder = new ModalBuilder()
    .setCustomId(modal.customId)
    .setTitle(modal.title)

  const components = Object.entries(modal.inputs).map(([id, input]) => {
    const builder = new TextInputBuilder()
      .setCustomId(id)
      .setLabel(input.label)
      .setStyle(TextInputStyle[input.style])

    input.value && builder.setValue(input.value)
    input.placeholder && builder.setPlaceholder(input.placeholder)
    input.required && builder.setRequired(input.required)
    input.minLength && builder.setMinLength(input.minLength)
    input.maxLength && builder.setMaxLength(input.maxLength)

    return builder
  })

  if (components.length > 0) {
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      components
    )

    builder.addComponents(actionRow)
  }

  return builder
}
