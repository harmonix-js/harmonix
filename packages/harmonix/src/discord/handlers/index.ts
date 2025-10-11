import { InteractionType } from 'discord.js'

import { handleCommandInteraction } from './command'
import { handleAutocompleteInteraction } from './autocomplete'
import {
  handleMessageComponentInteraction,
  handleModalSubmitInteraction
} from './component'

import type { Interaction } from 'discord.js'

import type { Harmonix } from '../../types/harmonix'

export const handleInteractionCreate = (
  harmonix: Harmonix,
  interaction: Interaction
) => {
  switch (interaction.type) {
    case InteractionType.ApplicationCommand: {
      handleCommandInteraction(harmonix, interaction)
      break
    }
    case InteractionType.ApplicationCommandAutocomplete: {
      handleAutocompleteInteraction(harmonix, interaction)
      break
    }
    case InteractionType.MessageComponent: {
      handleMessageComponentInteraction(harmonix, interaction)
      break
    }
    case InteractionType.ModalSubmit: {
      handleModalSubmitInteraction(harmonix, interaction)
      break
    }
  }
}
