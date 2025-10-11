import { ComponentType, SelectMenuType } from '../../types/module'

import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction
} from 'discord.js'

import type { Harmonix } from '../../types/harmonix'
import type {
  HarmonixButtonComponent,
  HarmonixModalComponent
} from '../../types/module'
import type { ExtractInputs, ModalInputMap } from '../../types/runtime/options'
import type { AnySelectMenuComponent } from '../../types/helper'

export const handleMessageComponentInteraction = (
  harmonix: Harmonix,
  interaction: AnySelectMenuInteraction | ButtonInteraction
) => {
  if (interaction.isButton()) {
    const button = harmonix.components.find(
      (c): c is HarmonixButtonComponent =>
        c.componentType === ComponentType.Button &&
        c.customId === interaction.customId
    )

    if (!button) return

    button.handler(interaction)
  }

  if (interaction.isAnySelectMenu()) {
    const selectMenu = harmonix.components.find(
      (c): c is AnySelectMenuComponent =>
        c.componentType === ComponentType.SelectMenu &&
        c.customId === interaction.customId
    )

    if (!selectMenu) return

    const selected = parseSelectMenuValues(interaction, selectMenu)

    selectMenu.handler(interaction as any, selected as any)
  }
}

export const handleModalSubmitInteraction = (
  harmonix: Harmonix,
  interaction: ModalSubmitInteraction
) => {
  const modal = harmonix.components.find(
    (c): c is HarmonixModalComponent =>
      c.componentType === ComponentType.Modal &&
      c.customId === interaction.customId
  )

  if (!modal) return

  const inputs = parseModalInputs(interaction, modal.inputs)

  modal.handler(interaction, inputs)
}

const parseModalInputs = <T extends ModalInputMap>(
  interaction: ModalSubmitInteraction,
  inputs: T
): ExtractInputs<T> => {
  const parsed: Record<string, unknown> = {}

  for (const [name] of Object.entries(inputs)) {
    parsed[name] = interaction.fields.getTextInputValue(name)
  }

  return parsed as ExtractInputs<T>
}

const parseSelectMenuValues = (
  interaction: AnySelectMenuInteraction,
  selectMenu: AnySelectMenuComponent
) => {
  switch (selectMenu.selectMenuType) {
    case SelectMenuType.String: {
      return interaction.values
    }
    case SelectMenuType.User: {
      if (!interaction.isUserSelectMenu()) return []

      return [...interaction.users.values()]
    }
    case SelectMenuType.Role: {
      if (!interaction.isRoleSelectMenu()) return []

      return [...interaction.roles.values()]
    }
    case SelectMenuType.Mentionable: {
      if (!interaction.isMentionableSelectMenu()) return []

      return {
        users: [...interaction.users.values()],
        roles: [...interaction.roles.values()]
      }
    }
    case SelectMenuType.Channel: {
      if (!interaction.isChannelSelectMenu()) return []

      return [...interaction.channels.values()]
    }
  }
}
