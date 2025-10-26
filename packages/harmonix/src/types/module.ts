import type {
  APIRole,
  ApplicationIntegrationType,
  ButtonInteraction,
  ButtonStyle,
  Channel,
  ChannelSelectMenuInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  ClientEvents,
  ComponentEmojiResolvable,
  InteractionContextType,
  MentionableSelectMenuInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  PermissionsString,
  Role,
  RoleSelectMenuInteraction,
  Snowflake,
  StringSelectMenuInteraction,
  User,
  UserContextMenuCommandInteraction,
  UserSelectMenuInteraction
} from 'discord.js'

import type { Awaitable, OneOrMany } from './utils'
import type {
  ExtractInputs,
  ExtractOptions,
  ModalInputMap,
  SlashOptionMap
} from './runtime/options'
import type { SlashCommandAutocomplete } from './runtime/command'
import type { Middleware } from './runtime/pipeline'

export enum ModuleType {
  Command = 'command',
  Event = 'event',
  Component = 'component'
}

interface HarmonixModule {
  type: ModuleType
  name: string
  path: string
}

export enum CommandType {
  Slash = 'slash',
  UserContextMenu = 'userContextMenu',
  MessageContextMenu = 'messageContextMenu'
}

export enum ComponentType {
  Button = 'button',
  SelectMenu = 'selectMenu',
  Modal = 'modal'
}

export enum SelectMenuType {
  String = 'string',
  User = 'user',
  Role = 'role',
  Mentionable = 'mentionable',
  Channel = 'channel'
}

export interface HarmonixCommand extends HarmonixModule {
  type: ModuleType.Command
  category?: string
  contexts?: OneOrMany<keyof typeof InteractionContextType>
  memberPermissions?: OneOrMany<PermissionsString>
  commandType: CommandType
  middleware?: Middleware[]
}

export interface HarmonixEvent<
  K extends keyof ClientEvents = keyof ClientEvents
> extends HarmonixModule {
  type: ModuleType.Event
  name: K
  once?: boolean
  callback: (...args: ClientEvents[K]) => Awaitable<void>
}

export interface HarmonixComponent extends HarmonixModule {
  type: ModuleType.Component
  customId: string
  componentType: ComponentType
}

interface HarmonixSlashCommandBase extends HarmonixCommand {
  commandType: CommandType.Slash
  description: string
  nsfw?: boolean
}

export interface HarmonixSlashCommandWithOptions<
  Options extends SlashOptionMap = SlashOptionMap
> extends HarmonixSlashCommandBase {
  options: Options
  autocomplete?: SlashCommandAutocomplete<Options>
  handler: (
    interaction: ChatInputCommandInteraction,
    options: ExtractOptions<Options>
  ) => Awaitable<void>
}

export interface HarmonixSlashCommandWithSubs<
  Subcommands extends Record<
    string,
    HarmonixSlashSubcommand | HarmonixSlashSubcommandGroup
  > = Record<string, HarmonixSlashSubcommand | HarmonixSlashSubcommandGroup>
> extends HarmonixSlashCommandBase {
  subcommands: Subcommands
}

export interface HarmonixSlashSubcommand<Options extends SlashOptionMap = any> {
  name?: string
  description: string
  options?: Options
  autocomplete?: SlashCommandAutocomplete<Options>
  handler: (
    interaction: ChatInputCommandInteraction,
    options: ExtractOptions<Options>
  ) => Awaitable<void>
}

export interface HarmonixSlashSubcommandGroup<
  Subs extends Record<string, HarmonixSlashSubcommand> = Record<
    string,
    HarmonixSlashSubcommand
  >
> {
  name?: string
  description: string
  subcommands: Subs
}

export type HarmonixSlashCommand =
  | HarmonixSlashCommandWithOptions
  | HarmonixSlashCommandWithSubs

export interface HarmonixUserContextMenuCommand extends HarmonixCommand {
  commandType: CommandType.UserContextMenu
  interactionTypes?: OneOrMany<keyof typeof ApplicationIntegrationType>
  handler: (interaction: UserContextMenuCommandInteraction) => Awaitable<void>
}

export interface HarmonixMessageContextMenuCommand extends HarmonixCommand {
  commandType: CommandType.MessageContextMenu
  interactionTypes?: OneOrMany<keyof typeof ApplicationIntegrationType>
  handler: (
    interaction: MessageContextMenuCommandInteraction
  ) => Awaitable<void>
}

export interface HarmonixButtonComponent extends HarmonixComponent {
  componentType: ComponentType.Button
  label: string
  style?: keyof typeof ButtonStyle
  disabled?: boolean
  emoji?: ComponentEmojiResolvable
  url?: string
  skuId?: Snowflake
  handler: (interaction: ButtonInteraction) => Awaitable<void>
}

export interface HarmonixModalComponent<
  Inputs extends ModalInputMap = ModalInputMap
> extends HarmonixComponent {
  componentType: ComponentType.Modal
  title: string
  inputs: Inputs
  handler: (
    interaction: ModalSubmitInteraction,
    inputs: ExtractInputs<Inputs>
  ) => Awaitable<void>
}

interface HarmonixSelectMenuComponent extends HarmonixComponent {
  componentType: ComponentType.SelectMenu
  customId: string
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
  selectMenuType: SelectMenuType
}

export interface HarmonixStringSelectMenuComponent
  extends HarmonixSelectMenuComponent {
  selectMenuType: SelectMenuType.String
  options: HarmonixStringSelectMenuOption[]
  handler: (
    interaction: StringSelectMenuInteraction,
    selected: Snowflake[]
  ) => Awaitable<void>
}

export interface HarmonixUserSelectMenuComponent
  extends HarmonixSelectMenuComponent {
  selectMenuType: SelectMenuType.User
  defaultUsers?: Snowflake[]
  handler: (
    interaction: UserSelectMenuInteraction,
    selected: User[]
  ) => Awaitable<void>
}

export interface HarmonixRoleSelectMenuComponent
  extends HarmonixSelectMenuComponent {
  selectMenuType: SelectMenuType.Role
  defaultRoles?: Snowflake[]
  handler: (
    interaction: RoleSelectMenuInteraction,
    selected: Role[]
  ) => Awaitable<void>
}

export interface HarmonixMentionableSelectMenuComponent
  extends HarmonixSelectMenuComponent {
  selectMenuType: SelectMenuType.Mentionable
  defaultValues?: Snowflake[]
  handler: (
    interaction: MentionableSelectMenuInteraction,
    selected: { users: User[]; roles: (Role | APIRole)[] }
  ) => Awaitable<void>
}

export interface HarmonixChannelSelectMenuComponent
  extends HarmonixSelectMenuComponent {
  selectMenuType: SelectMenuType.Channel
  channelTypes?: OneOrMany<keyof typeof ChannelType>
  defaultChannels?: Snowflake[]
  handler: (
    interaction: ChannelSelectMenuInteraction,
    selected: Channel[]
  ) => Awaitable<void>
}

export interface HarmonixStringSelectMenuOption {
  label: string
  value: string
  description?: string
  emoji?: ComponentEmojiResolvable
  default?: boolean
}
