import type {
  APIRole,
  ButtonInteraction,
  ButtonStyle,
  Channel,
  ChannelSelectMenuInteraction,
  ChannelType,
  ComponentEmojiResolvable,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  Role,
  RoleSelectMenuInteraction,
  Snowflake,
  StringSelectMenuInteraction,
  User,
  UserSelectMenuInteraction
} from 'discord.js'

import type { Awaitable, OneOrMany } from '../utils'
import type { HarmonixStringSelectMenuOption } from '../module'
import type { ExtractInputs, ModalInputMap } from './options'

export interface HarmonixButtonComponentConfig {
  label: string
  style?: keyof typeof ButtonStyle
  disabled?: boolean
  emoji?: ComponentEmojiResolvable
  url?: string
  skuId?: Snowflake
  customId?: string
}

export interface HarmonixButtonComponentHandler {
  (interaction: ButtonInteraction): Awaitable<void>
}

export interface HarmonixStringSelectMenuConfig {
  customId?: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  options: HarmonixStringSelectMenuOption[]
}

export interface HarmonixStringSelectMenuHandler {
  (
    interaction: StringSelectMenuInteraction,
    selected: Snowflake[]
  ): Awaitable<void>
}

export interface HarmonixUserSelectMenuConfig {
  customId?: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  defaultUsers?: Snowflake[]
}

export interface HarmonixUserSelectMenuHandler {
  (interaction: UserSelectMenuInteraction, selected: User[]): Awaitable<void>
}

export interface HarmonixRoleSelectMenuConfig {
  customId?: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  defaultRoles?: Snowflake[]
}

export interface HarmonixRoleSelectMenuHandler {
  (interaction: RoleSelectMenuInteraction, selected: Role[]): Awaitable<void>
}

export interface HarmonixMentionableSelectMenuConfig {
  customId?: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  defaultValues?: Snowflake[]
}

export interface HarmonixMentionableSelectMenuHandler {
  (
    interaction: MentionableSelectMenuInteraction,
    selected: { users: User[]; roles: (Role | APIRole)[] }
  ): Awaitable<void>
}

export interface HarmonixChannelSelectMenuConfig {
  customId?: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  defaultChannels?: Snowflake[]
  channelTypes?: OneOrMany<keyof typeof ChannelType>
}

export interface HarmonixChannelSelectMenuHandler {
  (
    interaction: ChannelSelectMenuInteraction,
    selected: Channel[]
  ): Awaitable<void>
}

export interface HarmonixModalComponentConfig<Inputs extends ModalInputMap> {
  title: string
  customId?: string
  inputs?: Inputs
}

export interface HarmonixModalComponentHandler<Inputs extends ModalInputMap> {
  (
    interaction: ModalSubmitInteraction,
    inputs: ExtractInputs<Inputs>
  ): Awaitable<void>
}
