import { isDevGuild } from '../../runtime/internal/utils'

import type { Snowflake } from 'discord.js'

import type { Harmonix } from '../../types'

const deleteApplicationCommand = async (harmonix: Harmonix, name: string) => {
  if (!harmonix.client.application) return

  await harmonix.client.application.commands.fetch()
  const existing = harmonix.client.application.commands.cache.find(
    (c) => c.name === name && !c.guildId
  )

  if (existing) {
    await harmonix.client.application.commands.delete(existing.id)
  }
}

const deleteGuildCommand = async (
  harmonix: Harmonix,
  guildId: Snowflake,
  name: string
) => {
  if (!harmonix.client.application) return

  await harmonix.client.application.commands.fetch({ guildId })
  const existing = harmonix.client.application.commands.cache.find(
    (c) => c.name === name && c.guildId === guildId
  )

  if (existing) {
    await harmonix.client.application.commands.delete(existing.id, guildId)
  }
}

export const deleteCommand = async (harmonix: Harmonix, name: string) => {
  if (isDevGuild(harmonix)) {
    await deleteGuildCommand(harmonix, harmonix.options.devGuild, name)
  } else {
    await deleteApplicationCommand(harmonix, name)
  }
}
