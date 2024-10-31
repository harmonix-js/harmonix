import { helpCommand } from './builtins'
import {
  resolveButton,
  resolveCommand,
  resolveContextMenu,
  resolveEvent,
  resolveModal,
  resolvePrecondition,
  resolveSelectMenu
} from './resolve'
import type { Harmonix, HarmonixCommand } from './types'

export const installEvents = async (harmonix: Harmonix) => {
  const _events = [...(harmonix.options.events || [])]
  const events = await Promise.all(
    _events.map((evt) => resolveEvent(evt, harmonix.options))
  )

  for (const evt of events) {
    if (evt.config.order) {
      harmonix.client?.events.set(
        `${evt.config.order}.${evt.config.name!}`,
        evt
      )
    } else {
      harmonix.client?.events.set(evt.config.name!, evt)
    }
  }
}

export const installCommands = async (harmonix: Harmonix) => {
  const _commands = [...(harmonix.options.commands || [])]
  const commands = await Promise.all(
    _commands.map((cmd) => resolveCommand(cmd, harmonix.options))
  )

  for (const cmd of commands) {
    harmonix.client?.commands.set(cmd.config.name!, cmd)
  }
  if (!harmonix.client?.commands.has('help')) {
    harmonix.client?.commands.set('help', helpCommand as HarmonixCommand<any>)
  }
}

export const installContextMenus = async (harmonix: Harmonix) => {
  const _contextMenus = [...(harmonix.options.contextMenus || [])]
  const contextMenus = await Promise.all(
    _contextMenus.map((ctm) => resolveContextMenu(ctm, harmonix.options))
  )

  for (const ctm of contextMenus) {
    harmonix.client?.contextMenus.set(ctm.config.name!, ctm)
  }
}

export const installButtons = async (harmonix: Harmonix) => {
  const _buttons = [...(harmonix.options.components?.buttons || [])]
  const buttons = await Promise.all(
    _buttons.map((btn) => resolveButton(btn, harmonix.options))
  )

  for (const btn of buttons) {
    harmonix.client?.components.buttons.set(btn.config.id!, btn)
  }
}

export const installModals = async (harmonix: Harmonix) => {
  const _modals = [...(harmonix.options.components?.modals || [])]
  const modals = await Promise.all(
    _modals.map((mdl) => resolveModal(mdl, harmonix.options))
  )

  for (const mdl of modals) {
    harmonix.client?.components.modals.set(mdl.config.id!, mdl)
  }
}

export const installSelectMenus = async (harmonix: Harmonix) => {
  const _selectMenus = [...(harmonix.options.components?.selectMenus || [])]
  const selectMenus = await Promise.all(
    _selectMenus.map((slm) => resolveSelectMenu(slm, harmonix.options))
  )

  for (const slm of selectMenus) {
    harmonix.client?.components.selectMenus.set(slm.config.id!, slm)
  }
}

export const installPreconditions = async (harmonix: Harmonix) => {
  const _preconditions = [...(harmonix.options.preconditions || [])]
  const preconditions = await Promise.all(
    _preconditions.map((prc) => resolvePrecondition(prc, harmonix.options))
  )

  for (const prc of preconditions) {
    harmonix.client?.preconditions.set(prc.name!, prc)
  }
}
