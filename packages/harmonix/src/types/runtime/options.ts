import type {
  APIApplicationCommandOptionChoice,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  ApplicationCommandOptionAllowedChannelTypes,
  Attachment,
  Channel,
  ChannelType,
  GuildMember,
  Role,
  TextInputStyle,
  User
} from 'discord.js'

import type { OneOrMany } from '../utils'

interface OptionTypeMap {
  String: string
  Integer: number
  Number: number
  Boolean: boolean
  User: User
  Channel: Channel
  Role: Role | APIRole
  Mentionable:
    | User
    | Role
    | APIRole
    | GuildMember
    | APIInteractionDataResolvedGuildMember
  Attachment: Attachment
}

type OptionKind = keyof OptionTypeMap

interface BaseOption<T extends OptionKind> {
  name?: string
  type: T
  description: string
  required?: boolean
}

interface WithRange {
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
}

interface WithAutocomplete<T> {
  autocomplete?: boolean
  choices?: APIApplicationCommandOptionChoice<T>[]
}

export interface StringOption
  extends BaseOption<'String'>,
    Pick<WithRange, 'minLength' | 'maxLength'>,
    WithAutocomplete<string> {}

export interface IntegerOption
  extends BaseOption<'Integer'>,
    Pick<WithRange, 'minValue' | 'maxValue'>,
    WithAutocomplete<number> {}

export interface NumberOption
  extends BaseOption<'Number'>,
    Pick<WithRange, 'minValue' | 'maxValue'>,
    WithAutocomplete<number> {}

export interface ChannelOption extends BaseOption<'Channel'> {
  channelTypes?: OneOrMany<AllowedChannelTypeNames>
}

export interface BooleanOption extends BaseOption<'Boolean'> {}
export interface UserOption extends BaseOption<'User'> {}
export interface RoleOption extends BaseOption<'Role'> {}
export interface MentionableOption extends BaseOption<'Mentionable'> {}
export interface AttachmentOption extends BaseOption<'Attachment'> {}

type SlashOption =
  | StringOption
  | IntegerOption
  | NumberOption
  | ChannelOption
  | BooleanOption
  | UserOption
  | RoleOption
  | MentionableOption
  | AttachmentOption

export type SlashOptionMap = Record<string, SlashOption>

type OptionValue<T extends SlashOption> = OptionTypeMap[T['type']]

export type ExtractOptions<T extends SlashOptionMap> = {
  [K in keyof T]: T[K]['required'] extends true
    ? OptionValue<T[K]>
    : OptionValue<T[K]> | undefined
}

type ChannelTypeName = keyof typeof ChannelType

type AllowedChannelTypeNames = {
  [K in ChannelTypeName]: (typeof ChannelType)[K] extends ApplicationCommandOptionAllowedChannelTypes
    ? K
    : never
}[ChannelTypeName]

interface ModalInput {
  label: string
  value?: string
  style: keyof typeof TextInputStyle
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export type ModalInputMap = Record<string, ModalInput>

export type ExtractInputs<T extends ModalInputMap> = {
  [K in keyof T]: T[K]['required'] extends true ? string : string | undefined
}
