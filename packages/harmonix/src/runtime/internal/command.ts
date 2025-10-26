import { CommandType, ModuleType } from '../../types/module'

import type {
  HarmonixMessageContextMenuCommand,
  HarmonixSlashCommandWithOptions,
  HarmonixSlashCommandWithSubs,
  HarmonixSlashSubcommand,
  HarmonixSlashSubcommandGroup,
  HarmonixUserContextMenuCommand
} from '../../types/module'
import type {
  HarmonixContextMenuConfig,
  HarmonixMessageContextMenuCommandHandler,
  HarmonixSlashCommandConfigBase,
  HarmonixSlashCommandConfigWithOptions,
  HarmonixSlashCommandConfigWithSubs,
  HarmonixSlashCommandHandler,
  HarmonixSlashSubcommandConfig,
  HarmonixSlashSubcommandGroupConfig,
  HarmonixUserContextMenuCommandHandler
} from '../../types/runtime/command'
import type { SlashOptionMap } from '../../types/runtime/options'

export function defineSlashCommand<Options extends SlashOptionMap>(
  config: HarmonixSlashCommandConfigWithOptions<Options>,
  handler: HarmonixSlashCommandHandler<Options>
): HarmonixSlashCommandWithOptions<Options>

export function defineSlashCommand<
  Subs extends Record<
    string,
    HarmonixSlashSubcommand | HarmonixSlashSubcommandGroup<any>
  >
>(
  config: HarmonixSlashCommandConfigWithSubs<Subs>
): HarmonixSlashCommandWithSubs<Subs>

export function defineSlashCommand(
  config: HarmonixSlashCommandConfigBase,
  handler: HarmonixSlashCommandHandler<any>
): HarmonixSlashCommandWithOptions<any>

export function defineSlashCommand(
  config: any,
  handler?: (...args: any[]) => any
): any {
  return {
    type: ModuleType.Command,
    commandType: CommandType.Slash,
    name: config.name,
    category: config.category,
    description: config.description,
    contexts: config.contexts,
    memberPermissions: config.memberPermissions,
    nsfw: config.nsfw,
    middleware: config.middleware ?? [],
    ...(config.subcommands
      ? { subcommands: config.subcommands }
      : { options: config.options, autocomplete: config.autocomplete, handler })
  }
}

export const defineSlashSubcommand = <Options extends SlashOptionMap>(
  config: HarmonixSlashSubcommandConfig<Options>,
  handler: HarmonixSlashCommandHandler<Options>
): HarmonixSlashSubcommand<Options> => {
  return {
    name: config.name,
    description: config.description,
    options: config.options,
    autocomplete: config.autocomplete,
    handler
  }
}

export function defineSlashSubcommandGroup<
  Subs extends Record<string, HarmonixSlashSubcommand>
>(
  config: HarmonixSlashSubcommandGroupConfig<Subs>
): HarmonixSlashSubcommandGroup<Subs> {
  return {
    name: config.name,
    description: config.description,
    subcommands: config.subcommands
  }
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
