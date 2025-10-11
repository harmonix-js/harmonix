import { isDevGuild, toAPICommand } from '../../runtime/internal/utils'

import type { Snowflake } from 'discord.js'

import type { Harmonix } from '../../types'
import type { AnyCommand } from '../../types/helper'
import type { HarmonixCommand } from '../../types/module'

const upsertApplicationCommand = async (
  harmonix: Harmonix,
  command: HarmonixCommand
) => {
  if (!harmonix.client.application) return

  const body = toAPICommand(command as AnyCommand)

  await harmonix.client.application.commands.fetch()
  const existing = harmonix.client.application.commands.cache.find(
    (c) => c.name === command.name && !c.guildId
  )

  if (existing)
    await harmonix.client.application.commands.edit(existing.id, body)
  else await harmonix.client.application.commands.create(body)

  harmonix.logger.success(`Synced command \`${command.name}\` to application.`)
}

const upsertGuildCommand = async (
  harmonix: Harmonix,
  guildId: Snowflake,
  command: HarmonixCommand
) => {
  if (!harmonix.client.application) return

  const body = toAPICommand(command as AnyCommand)

  await harmonix.client.application.commands.fetch({ guildId })
  const existing = harmonix.client.application.commands.cache.find(
    (c) => c.name === command.name && c.guildId === guildId
  )

  if (existing) {
    await harmonix.client.application.commands.edit(existing.id, body, guildId)
  } else {
    await harmonix.client.application.commands.create(body, guildId)
  }

  const guild = await harmonix.client.guilds.fetch(guildId)

  harmonix.logger.success(
    `Synced command \`${command.name}\` to guild \`${guild.name}\`.`
  )
}

export const upsertCommand = async (
  harmonix: Harmonix,
  command: HarmonixCommand
) => {
  if (isDevGuild(harmonix)) {
    await upsertGuildCommand(harmonix, harmonix.options.devGuild, command)
  } else {
    await upsertApplicationCommand(harmonix, command)
  }
}
