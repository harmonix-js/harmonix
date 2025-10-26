import { runPipeline } from '../../pipeline'
import { CommandType } from '../../types/module'

import type {
  ChatInputCommandInteraction,
  CommandInteraction
} from 'discord.js'

import type { Harmonix } from '../../types/harmonix'
import type { AnyCommand } from '../../types/helper'
import type {
  ExtractOptions,
  SlashOptionMap
} from '../../types/runtime/options'

export const handleCommandInteraction = async (
  harmonix: Harmonix,
  interaction: CommandInteraction
) => {
  const command = harmonix.commands.find(
    (cmd): cmd is AnyCommand => cmd.name === interaction.commandName
  )
  if (!command) return

  switch (command.commandType) {
    case CommandType.Slash: {
      if (!interaction.isChatInputCommand()) break

      if ('subcommands' in command) {
        const groupName = interaction.options.getSubcommandGroup(false)
        const subName = interaction.options.getSubcommand(false)

        if (groupName && subName) {
          const group = command.subcommands[groupName]

          if (!group || !('subcommands' in group)) break
          const sub = group.subcommands[subName]

          if (!sub) break

          const options = parseSlashOptions(interaction, sub.options ?? {})
          await runPipeline(interaction, command.middleware, async (i) =>
            sub.handler(i as any, options)
          )
        } else if (subName) {
          const sub = command.subcommands[subName]

          if (!sub || 'subcommands' in sub) break
          const options = parseSlashOptions(interaction, sub.options ?? {})

          await runPipeline(interaction, command.middleware, async (i) =>
            sub.handler(i as any, options)
          )
        }

        break
      }

      if ('options' in command && 'handler' in command) {
        const options = parseSlashOptions(interaction, command.options ?? {})

        await runPipeline(interaction, command.middleware, async (i) =>
          command.handler(i as any, options)
        )
        break
      }
      break
    }

    case CommandType.UserContextMenu: {
      if (!interaction.isUserContextMenuCommand()) break

      await runPipeline(interaction, command.middleware, async (i) =>
        command.handler(i as any)
      )
      break
    }

    case CommandType.MessageContextMenu: {
      if (!interaction.isMessageContextMenuCommand()) break

      await runPipeline(interaction, command.middleware, async (i) =>
        command.handler(i as any)
      )
      break
    }
  }
}

const optionResolvers: Record<
  string,
  (i: ChatInputCommandInteraction, name: string) => unknown
> = {
  String: (i, name) => i.options.getString(name),
  Integer: (i, name) => i.options.getInteger(name),
  Number: (i, name) => i.options.getNumber(name),
  Boolean: (i, name) => i.options.getBoolean(name),
  Channel: (i, name) => i.options.getChannel(name),
  User: (i, name) => i.options.getUser(name),
  Role: (i, name) => i.options.getRole(name),
  Mentionable: (i, name) => i.options.getMentionable(name),
  Attachment: (i, name) => i.options.getAttachment(name)
}

const parseSlashOptions = <T extends SlashOptionMap>(
  interaction: ChatInputCommandInteraction,
  options: T
) => {
  const parsed: Record<string, unknown> = {}

  for (const [name, option] of Object.entries(options)) {
    const resolver = optionResolvers[option.type]

    parsed[name] = resolver(interaction, name)
  }

  return parsed as ExtractOptions<T>
}
