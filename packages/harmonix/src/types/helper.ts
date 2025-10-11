import type {
  HarmonixChannelSelectMenuComponent,
  HarmonixCommand,
  HarmonixComponent,
  HarmonixEvent,
  HarmonixMentionableSelectMenuComponent,
  HarmonixMessageContextMenuCommand,
  HarmonixRoleSelectMenuComponent,
  HarmonixSlashCommand,
  HarmonixStringSelectMenuComponent,
  HarmonixUserContextMenuCommand,
  HarmonixUserSelectMenuComponent
} from './module'

export type AnyModule = HarmonixCommand | HarmonixEvent | HarmonixComponent

export type AnyCommand =
  | HarmonixSlashCommand
  | HarmonixUserContextMenuCommand
  | HarmonixMessageContextMenuCommand

export type AnySelectMenuComponent =
  | HarmonixStringSelectMenuComponent
  | HarmonixUserSelectMenuComponent
  | HarmonixRoleSelectMenuComponent
  | HarmonixMentionableSelectMenuComponent
  | HarmonixChannelSelectMenuComponent
