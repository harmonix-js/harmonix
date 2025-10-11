import type {
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageContextMenuCommandInteraction,
  PermissionsString,
  UserContextMenuCommandInteraction
} from 'discord.js'

import type { Awaitable, MatchingKeys, OneOrMany } from '../utils'
import type { ExtractOptions, SlashOptionMap } from './options'
import type { Middleware } from './pipeline'

export interface HarmonixSlashCommandConfig<Options extends SlashOptionMap> {
  name?: string
  category?: string
  description: string
  contexts?: OneOrMany<keyof typeof InteractionContextType>
  memberPermissions?: OneOrMany<PermissionsString>
  nsfw?: boolean
  options?: Options
  autocomplete?: SlashCommandAutocomplete<Options>
  middleware?: Middleware[]
}

export type SlashCommandAutocomplete<Options extends SlashOptionMap> = {
  [K in MatchingKeys<Options, { autocomplete: true }>]: (
    interaction: AutocompleteInteraction
  ) => Awaitable<void>
}

export interface HarmonixSlashCommandHandler<Options extends SlashOptionMap> {
  (
    interaction: ChatInputCommandInteraction,
    options: ExtractOptions<Options>
  ): Awaitable<void>
}

export interface HarmonixContextMenuConfig {
  name?: string
  category?: string
  contexts?: OneOrMany<keyof typeof InteractionContextType>
  memberPermissions?: OneOrMany<PermissionsString>
  integrationTypes?: OneOrMany<keyof typeof ApplicationIntegrationType>
  middleware?: Middleware[]
}

export interface HarmonixUserContextMenuCommandHandler {
  (interaction: UserContextMenuCommandInteraction): Awaitable<void>
}

export interface HarmonixMessageContextMenuCommandHandler {
  (interaction: MessageContextMenuCommandInteraction): Awaitable<void>
}
