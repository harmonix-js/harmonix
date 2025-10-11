import { buildButtonComponent } from '../../discord/builders/buttons'
import { buildModalComponent } from '../../discord/builders/modals'
import { useHarmonix } from '../../context'
import { ComponentType, ModuleType, SelectMenuType } from '../../types/module'

import {
  buildChannelSelectMenuComponent,
  buildMentionableSelectMenuComponent,
  buildRoleSelectMenuComponent,
  buildStringSelectMenuComponent,
  buildUserSelectMenuComponent
} from '../../discord/builders/select-menu'

import type {
  HarmonixButtonComponent,
  HarmonixChannelSelectMenuComponent,
  HarmonixMentionableSelectMenuComponent,
  HarmonixModalComponent,
  HarmonixRoleSelectMenuComponent,
  HarmonixStringSelectMenuComponent,
  HarmonixUserSelectMenuComponent
} from '../../types/module'
import type {
  HarmonixButtonComponentConfig,
  HarmonixButtonComponentHandler,
  HarmonixChannelSelectMenuConfig,
  HarmonixChannelSelectMenuHandler,
  HarmonixMentionableSelectMenuConfig,
  HarmonixMentionableSelectMenuHandler,
  HarmonixModalComponentConfig,
  HarmonixModalComponentHandler,
  HarmonixRoleSelectMenuConfig,
  HarmonixRoleSelectMenuHandler,
  HarmonixStringSelectMenuConfig,
  HarmonixStringSelectMenuHandler,
  HarmonixUserSelectMenuConfig,
  HarmonixUserSelectMenuHandler
} from '../../types/runtime/component'
import type { ModalInputMap } from '../../types/runtime/options'
import type { AnySelectMenuComponent } from '../../types/helper'

export const defineButtonComponent = (
  config: HarmonixButtonComponentConfig,
  handler: HarmonixButtonComponentHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    label: config.label,
    style: config.style,
    disabled: config.disabled,
    emoji: config.emoji,
    url: config.url,
    skuId: config.skuId,
    componentType: ComponentType.Button,
    handler
  } as HarmonixButtonComponent
}

export const defineStringSelectMenuComponent = (
  config: HarmonixStringSelectMenuConfig,
  handler: HarmonixStringSelectMenuHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    disabled: config.disabled,
    maxValues: config.maxValues,
    minValues: config.minValues,
    placeholder: config.placeholder,
    options: config.options,
    componentType: ComponentType.SelectMenu,
    selectMenuType: SelectMenuType.String,
    handler
  } as HarmonixStringSelectMenuComponent
}

export const defineUserSelectMenuComponent = (
  config: HarmonixUserSelectMenuConfig,
  handler: HarmonixUserSelectMenuHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    disabled: config.disabled,
    maxValues: config.maxValues,
    minValues: config.minValues,
    placeholder: config.placeholder,
    defaultUsers: config.defaultUsers,
    componentType: ComponentType.SelectMenu,
    selectMenuType: SelectMenuType.User,
    handler
  } as HarmonixUserSelectMenuComponent
}

export const defineRoleSelectMenuComponent = (
  config: HarmonixRoleSelectMenuConfig,
  handler: HarmonixRoleSelectMenuHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    disabled: config.disabled,
    maxValues: config.maxValues,
    minValues: config.minValues,
    placeholder: config.placeholder,
    defaultRoles: config.defaultRoles,
    componentType: ComponentType.SelectMenu,
    selectMenuType: SelectMenuType.Role,
    handler
  } as HarmonixRoleSelectMenuComponent
}

export const defineMentionableSelectMenuComponent = (
  config: HarmonixMentionableSelectMenuConfig,
  handler: HarmonixMentionableSelectMenuHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    disabled: config.disabled,
    maxValues: config.maxValues,
    minValues: config.minValues,
    placeholder: config.placeholder,
    defaultValues: config.defaultValues,
    componentType: ComponentType.SelectMenu,
    selectMenuType: SelectMenuType.Mentionable,
    handler
  } as HarmonixMentionableSelectMenuComponent
}

export const defineChannelSelectMenuComponent = (
  config: HarmonixChannelSelectMenuConfig,
  handler: HarmonixChannelSelectMenuHandler
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    disabled: config.disabled,
    maxValues: config.maxValues,
    minValues: config.minValues,
    placeholder: config.placeholder,
    channelTypes: config.channelTypes,
    componentType: ComponentType.SelectMenu,
    selectMenuType: SelectMenuType.Channel,
    handler
  } as HarmonixChannelSelectMenuComponent
}

export const defineModalComponent = <Inputs extends ModalInputMap>(
  config: HarmonixModalComponentConfig<Inputs>,
  handler: HarmonixModalComponentHandler<Inputs>
) => {
  return {
    type: ModuleType.Component,
    name: config.customId,
    customId: config.customId,
    title: config.title,
    inputs: config.inputs ?? {},
    componentType: ComponentType.Modal,
    handler
  } as HarmonixModalComponent
}

export const useButton = (name: string) => {
  const { components } = useHarmonix()
  const button = components.find(
    (c): c is HarmonixButtonComponent =>
      c.componentType === ComponentType.Button && c.name === name
  )

  if (!button) {
    throw new Error(`Button component "${name}" not found.`)
  }

  return buildButtonComponent(button)
}

export const useSelectMenu = (name: string) => {
  const { components } = useHarmonix()
  const selectMenu = components.find(
    (c): c is AnySelectMenuComponent =>
      c.componentType === ComponentType.SelectMenu && c.name === name
  )

  if (!selectMenu) {
    throw new Error(`Select menu component "${name}" not found.`)
  }

  switch (selectMenu.selectMenuType) {
    case SelectMenuType.String: {
      return buildStringSelectMenuComponent(selectMenu)
    }
    case SelectMenuType.User: {
      return buildUserSelectMenuComponent(selectMenu)
    }
    case SelectMenuType.Role: {
      return buildRoleSelectMenuComponent(selectMenu)
    }
    case SelectMenuType.Mentionable: {
      return buildMentionableSelectMenuComponent(selectMenu)
    }
    case SelectMenuType.Channel: {
      return buildChannelSelectMenuComponent(selectMenu)
    }
  }
}

export const useModal = (name: string) => {
  const { components } = useHarmonix()
  const modal = components.find(
    (c): c is HarmonixModalComponent =>
      c.componentType === ComponentType.Modal && c.name === name
  )

  if (!modal) {
    throw new Error(`Modal component "${name}" not found.`)
  }

  return buildModalComponent(modal)
}
