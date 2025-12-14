import type { AutocompleteInteraction, Awaitable } from 'discord.js'

import type { Harmonix } from '../../types/harmonix'
import type { HarmonixSlashCommandWithOptions } from '../../types/module'

export async function handleAutocompleteInteraction(
  harmonix: Harmonix,
  interaction: AutocompleteInteraction
) {
  const command = harmonix.commands.find(
    (cmd): cmd is HarmonixSlashCommandWithOptions =>
      cmd.name === interaction.commandName && 'autocomplete' in cmd
  )

  if (!command || !command.autocomplete) return

  const focused = interaction.options.getFocused(true)
  const handler: (interaction: AutocompleteInteraction) => Awaitable<void> =
    command.autocomplete[focused.name as keyof typeof command.autocomplete]

  if (!handler) return

  await handler(interaction)
}
