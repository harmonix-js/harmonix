import {
  ChannelSelectMenuBuilder,
  ChannelType,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder
} from 'discord.js'

import { toArray } from '../../utils/helpers'

import type {
  HarmonixChannelSelectMenuComponent,
  HarmonixMentionableSelectMenuComponent,
  HarmonixRoleSelectMenuComponent,
  HarmonixStringSelectMenuComponent,
  HarmonixUserSelectMenuComponent
} from '../../types/module'

export const buildStringSelectMenuComponent = (
  selectMenu: HarmonixStringSelectMenuComponent
) => {
  const builder = new StringSelectMenuBuilder().setCustomId(selectMenu.customId)

  selectMenu.placeholder && builder.setPlaceholder(selectMenu.placeholder)
  selectMenu.disabled && builder.setDisabled(selectMenu.disabled)
  selectMenu.maxValues && builder.setMaxValues(selectMenu.maxValues)
  selectMenu.minValues && builder.setMinValues(selectMenu.minValues)
  selectMenu.options && builder.setOptions(selectMenu.options)

  return builder
}

export const buildUserSelectMenuComponent = (
  selectMenu: HarmonixUserSelectMenuComponent
) => {
  const builder = new UserSelectMenuBuilder().setCustomId(selectMenu.customId)

  selectMenu.placeholder && builder.setPlaceholder(selectMenu.placeholder)
  selectMenu.disabled && builder.setDisabled(selectMenu.disabled)
  selectMenu.maxValues && builder.setMaxValues(selectMenu.maxValues)
  selectMenu.minValues && builder.setMinValues(selectMenu.minValues)
  selectMenu.defaultUsers && builder.setDefaultUsers(selectMenu.defaultUsers)

  return builder
}

export const buildRoleSelectMenuComponent = (
  selectMenu: HarmonixRoleSelectMenuComponent
) => {
  const builder = new RoleSelectMenuBuilder().setCustomId(selectMenu.customId)

  selectMenu.placeholder && builder.setPlaceholder(selectMenu.placeholder)
  selectMenu.disabled && builder.setDisabled(selectMenu.disabled)
  selectMenu.maxValues && builder.setMaxValues(selectMenu.maxValues)
  selectMenu.minValues && builder.setMinValues(selectMenu.minValues)
  selectMenu.defaultRoles && builder.setDefaultRoles(selectMenu.defaultRoles)

  return builder
}

export const buildMentionableSelectMenuComponent = (
  selectMenu: HarmonixMentionableSelectMenuComponent
) => {
  const builder = new MentionableSelectMenuBuilder().setCustomId(
    selectMenu.customId
  )

  selectMenu.placeholder && builder.setPlaceholder(selectMenu.placeholder)
  selectMenu.disabled && builder.setDisabled(selectMenu.disabled)
  selectMenu.maxValues && builder.setMaxValues(selectMenu.maxValues)
  selectMenu.minValues && builder.setMinValues(selectMenu.minValues)
  selectMenu.defaultValues && builder.setDefaultValues()

  return builder
}

export const buildChannelSelectMenuComponent = (
  selectMenu: HarmonixChannelSelectMenuComponent
) => {
  const builder = new ChannelSelectMenuBuilder().setCustomId(
    selectMenu.customId
  )

  selectMenu.placeholder && builder.setPlaceholder(selectMenu.placeholder)
  selectMenu.disabled && builder.setDisabled(selectMenu.disabled)
  selectMenu.maxValues && builder.setMaxValues(selectMenu.maxValues)
  selectMenu.minValues && builder.setMinValues(selectMenu.minValues)
  selectMenu.channelTypes &&
    builder.setChannelTypes(
      toArray(selectMenu.channelTypes).map((type) => ChannelType[type])
    )
  selectMenu.defaultChannels &&
    builder.setDefaultChannels(selectMenu.defaultChannels)

  return builder
}
