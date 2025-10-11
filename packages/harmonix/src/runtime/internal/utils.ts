import { REST } from 'discord.js'
import { isDevelopment } from 'std-env'

import { buildSlashCommand } from '../../discord/builders/slash'
import { buildContextMenuCommand } from '../../discord/builders/context-menu'
import { CommandType } from '../../types/module'
import { isEnvRef, resolveEnvRef } from '../../config/env'

import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'

import type { Harmonix } from '../../types/harmonix'
import type { AnyCommand } from '../../types/helper'

export const isDevGuild = (harmonix: Harmonix) =>
  isDevelopment && !!harmonix.options.devGuild

export const toAPICommand = (
  command: AnyCommand
): RESTPostAPIApplicationCommandsJSONBody => {
  switch (command.commandType) {
    case CommandType.Slash: {
      return buildSlashCommand(command)
    }
    default: {
      return buildContextMenuCommand(command)
    }
  }
}

export const useRest = (harmonix: Harmonix) => {
  let token = harmonix.options.token

  if (isEnvRef(token)) {
    token = resolveEnvRef(token)!
  }

  return new REST({ version: '10', userAgentAppendix: 'harmonix' }).setToken(
    token
  )
}
