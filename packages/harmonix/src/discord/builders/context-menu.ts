import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  ContextMenuCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits
} from 'discord.js'

import { toArray } from '../../utils/helpers'
import { CommandType } from '../../types/module'

import type {
  HarmonixMessageContextMenuCommand,
  HarmonixUserContextMenuCommand
} from '../../types/module'

export const buildContextMenuCommand = (
  command: HarmonixUserContextMenuCommand | HarmonixMessageContextMenuCommand
) => {
  const builder = new ContextMenuCommandBuilder()
    .setName(command.name)
    .setType(
      command.commandType === CommandType.UserContextMenu
        ? ApplicationCommandType.User
        : ApplicationCommandType.Message
    )

  if (command.memberPermissions) {
    const mp = toArray(command.memberPermissions).reduce(
      (acc, perm) => acc | PermissionFlagsBits[perm],
      0n
    )

    builder.setDefaultMemberPermissions(mp)
  }

  if (command.contexts) {
    const contexts = toArray(command.contexts).map(
      (ctx) => InteractionContextType[ctx]
    )

    builder.setContexts(contexts)
  }

  if (command.interactionTypes) {
    const types = toArray(command.interactionTypes).map(
      (t) => ApplicationIntegrationType[t]
    )

    builder.setIntegrationTypes(types)
  }

  return builder.toJSON()
}
