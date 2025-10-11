import {
  ChannelType,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js'

import { toArray } from '../../utils/helpers'

import type { HarmonixSlashCommand } from '../../types/module'
import type {
  AttachmentOption,
  BooleanOption,
  ChannelOption,
  IntegerOption,
  MentionableOption,
  NumberOption,
  RoleOption,
  SlashOptionMap,
  StringOption,
  UserOption
} from '../../types/runtime/options'

export const buildSlashCommand = (command: HarmonixSlashCommand) => {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .setNSFW(command.nsfw ?? false)

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

  addOptions(builder, command.options)

  return builder.toJSON()
}

const addOptions = (builder: SlashCommandBuilder, options: SlashOptionMap) => {
  for (const [name, option] of Object.entries(options)) {
    switch (option.type) {
      case 'String': {
        addStringOption(builder, name, option)
        break
      }
      case 'Integer': {
        addIntegerOption(builder, name, option)
        break
      }
      case 'Number': {
        addNumberOption(builder, name, option)
        break
      }
      case 'Boolean': {
        addBooleanOption(builder, name, option)
        break
      }
      case 'Channel': {
        addChannelOption(builder, name, option)
        break
      }
      case 'User': {
        addUserOption(builder, name, option)
        break
      }
      case 'Role': {
        addRoleOption(builder, name, option)
        break
      }
      case 'Mentionable': {
        addMentionableOption(builder, name, option)
        break
      }
      case 'Attachment': {
        addAttachmentOption(builder, name, option)
        break
      }
    }
  }
}

const addStringOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: StringOption
) => {
  builder.addStringOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)
    opt.setAutocomplete(option.autocomplete ?? false)

    option.minLength && opt.setMinLength(option.minLength)
    option.maxLength && opt.setMaxLength(option.maxLength)
    option.choices && opt.addChoices(option.choices)

    return opt
  })
}

const addIntegerOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: IntegerOption
) => {
  builder.addIntegerOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)
    opt.setAutocomplete(option.autocomplete ?? false)

    option.minValue && opt.setMinValue(option.minValue)
    option.maxValue && opt.setMaxValue(option.maxValue)
    option.choices && opt.addChoices(option.choices)

    return opt
  })
}

const addNumberOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: NumberOption
) => {
  builder.addNumberOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)
    opt.setAutocomplete(option.autocomplete ?? false)

    option.minValue && opt.setMinValue(option.minValue)
    option.maxValue && opt.setMaxValue(option.maxValue)
    option.choices && opt.addChoices(option.choices)

    return opt
  })
}

const addBooleanOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: BooleanOption
) => {
  builder.addBooleanOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    return opt
  })
}

const addChannelOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: ChannelOption
) => {
  builder.addChannelOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    if (option.channelTypes) {
      const types = toArray(option.channelTypes).map(
        (type) => ChannelType[type]
      )

      opt.addChannelTypes(types)
    }

    return opt
  })
}

const addUserOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: UserOption
) => {
  builder.addUserOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    return opt
  })
}

const addRoleOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: RoleOption
) => {
  builder.addRoleOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    return opt
  })
}

const addMentionableOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: MentionableOption
) => {
  builder.addMentionableOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    return opt
  })
}

const addAttachmentOption = (
  builder: SlashCommandBuilder,
  name: string,
  option: AttachmentOption
) => {
  builder.addAttachmentOption((opt) => {
    opt.setName(option.name ?? name)
    opt.setDescription(option.description)
    opt.setRequired(option.required ?? false)

    return opt
  })
}
