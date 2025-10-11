import { Routes } from 'discord.js'

import { isDevGuild, toAPICommand, useRest } from '../../runtime/internal/utils'

import type {
  APIApplicationCommand,
  RESTPutAPIApplicationCommandsJSONBody,
  Snowflake
} from 'discord.js'

import type { Harmonix } from '../../types'
import type { AnyCommand } from '../../types/helper'

const syncApplicationCommands = async (
  harmonix: Harmonix<true>,
  body: RESTPutAPIApplicationCommandsJSONBody
) => {
  await harmonix.callHook('commands:sync:will', {
    scope: 'global',
    payload: body
  })
  const rest = useRest(harmonix)
  const result = (await rest.put(
    Routes.applicationCommands(harmonix.client.user.id),
    { body }
  )) as APIApplicationCommand[]

  await harmonix.callHook('commands:sync:did', { scope: 'global', result })
  harmonix.logger.success(
    `Synced ${harmonix.commands.size} commands to application.`
  )
}

const syncGuildCommands = async (
  harmonix: Harmonix<true>,
  guildId: Snowflake,
  body: RESTPutAPIApplicationCommandsJSONBody
) => {
  await harmonix.callHook('commands:sync:will', {
    scope: 'guild',
    guildId,
    payload: body
  })
  const rest = useRest(harmonix)
  const result = (await rest.put(
    Routes.applicationGuildCommands(harmonix.client.user.id, guildId),
    { body }
  )) as APIApplicationCommand[]
  const guild = await harmonix.client.guilds.fetch(guildId)

  await harmonix.callHook('commands:sync:did', {
    scope: 'guild',
    guildId,
    result
  })
  harmonix.logger.success(
    `Synced ${harmonix.commands.size} commands to guild \`${guild.name}\`.`
  )
}

export const syncCommands = async (harmonix: Harmonix<true>) => {
  const body = harmonix.commands.map((cmd) => toAPICommand(cmd as AnyCommand))

  if (isDevGuild(harmonix)) {
    await syncGuildCommands(harmonix, harmonix.options.devGuild, body)
  } else {
    await syncApplicationCommands(harmonix, body)
  }
}
