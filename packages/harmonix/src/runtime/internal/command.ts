import { CommandType, ModuleType } from '../../types/module'

import type {
  HarmonixMessageContextMenuCommand,
  HarmonixSlashCommand,
  HarmonixUserContextMenuCommand
} from '../../types/module'
import type {
  HarmonixContextMenuConfig,
  HarmonixMessageContextMenuCommandHandler,
  HarmonixSlashCommandConfig,
  HarmonixSlashCommandHandler,
  HarmonixUserContextMenuCommandHandler
} from '../../types/runtime/command'
import type { SlashOptionMap } from '../../types/runtime/options'

export const defineSlashCommand = <Options extends SlashOptionMap>(
  config: HarmonixSlashCommandConfig<Options>,
  handler: HarmonixSlashCommandHandler<Options>
) => {
  return {
    type: ModuleType.Command,
    name: config.name,
    category: config.category,
    description: config.description,
    contexts: config.contexts,
    memberPermissions: config.memberPermissions,
    nsfw: config.nsfw,
    options: config.options ?? {},
    autocomplete: config.autocomplete,
    middleware: config.middleware ?? [],
    commandType: CommandType.Slash,
    handler
  } as HarmonixSlashCommand
}

export function defineUserContextMenuCommand(
  handler: HarmonixUserContextMenuCommandHandler
): HarmonixUserContextMenuCommand

export function defineUserContextMenuCommand(
  config: HarmonixContextMenuConfig,
  handler: HarmonixUserContextMenuCommandHandler
): HarmonixUserContextMenuCommand

export function defineUserContextMenuCommand(
  configOrHandler:
    | HarmonixContextMenuConfig
    | HarmonixUserContextMenuCommandHandler,
  maybeHandler?: HarmonixUserContextMenuCommandHandler
) {
  const config = typeof configOrHandler === 'function' ? {} : configOrHandler
  const handler =
    typeof configOrHandler === 'function' ? configOrHandler : maybeHandler

  return {
    type: ModuleType.Command,
    name: config.name,
    category: config.category,
    contexts: config.contexts,
    memberPermissions: config.memberPermissions,
    interactionTypes: config.integrationTypes,
    middleware: config.middleware ?? [],
    commandType: CommandType.UserContextMenu,
    handler
  } as HarmonixUserContextMenuCommand
}

export function defineMessageContextMenuCommand(
  configOrHandler:
    | HarmonixContextMenuConfig
    | HarmonixMessageContextMenuCommandHandler,
  maybeHandler?: HarmonixMessageContextMenuCommandHandler
) {
  const config = typeof configOrHandler === 'function' ? {} : configOrHandler
  const handler =
    typeof configOrHandler === 'function' ? configOrHandler : maybeHandler

  return {
    type: ModuleType.Command,
    name: config.name,
    category: config.category,
    contexts: config.contexts,
    memberPermissions: config.memberPermissions,
    interactionTypes: config.integrationTypes,
    middleware: config.middleware ?? [],
    commandType: CommandType.MessageContextMenu,
    handler
  } as HarmonixMessageContextMenuCommand
}
