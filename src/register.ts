import {
  ClientEvents,
  Events,
  MessageContextMenuCommandInteraction
} from 'discord.js'
import consola from 'consola'
import { resolveOption } from './utils'
import { createError, ctx } from './harmonix'
import type { ParsedInputs, ParsedOptions, RuntimeHarmonix } from './types'

export const registerEvents = (harmonix: RuntimeHarmonix) => {
  for (const [, event] of harmonix.client.events) {
    if (event.config.name === 'ready') continue
    if (event.config.once) {
      harmonix.client.once(event.config.name!, (...args) => {
        ctx.call(harmonix as RuntimeHarmonix, () =>
          event.callback(...(args as ClientEvents[keyof ClientEvents]))
        )
      })
    } else {
      harmonix.client.on(event.config.name!, (...args) => {
        ctx.call(harmonix as RuntimeHarmonix, () =>
          event.callback(...(args as ClientEvents[keyof ClientEvents]))
        )
      })
    }
  }
}

export const registerCommands = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = harmonix.client.commands.get(interaction.commandName)
    const cmdOptions = Object.entries(cmd?.config.options ?? {}).map(
      ([key, _]) => ({ name: key })
    )

    if (!cmd) return
    const options = await cmdOptions.reduce<Promise<ParsedOptions>>(
      async (acc, opt) => {
        const resolvedAcc = await acc
        const resolvedOption = await resolveOption(
          interaction,
          cmd.config.options![opt.name]?.type,
          opt.name
        )

        return {
          ...resolvedAcc,
          [opt.name]: resolvedOption
        }
      },
      Promise.resolve({})
    )

    if (cmd.config.preconditions) {
      for (const prc of cmd.config.preconditions) {
        const precondition = harmonix.client.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition \`${prc}\` not found.`)
          continue
        }
        const result = await ctx.call(
          harmonix as RuntimeHarmonix,
          async () => await precondition.callback(interaction)
        )

        if (!result) return
      }
    }
    ctx.call(harmonix as RuntimeHarmonix, () =>
      cmd.execute(interaction, { options })
    )
  })
}

export const registerContextMenu = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isContextMenuCommand()) return
    const ctm = harmonix.client.contextMenus.get(interaction.commandName)

    if (!ctm) return
    if (ctm.config.preconditions) {
      for (const prc of ctm.config.preconditions) {
        const precondition = harmonix.client.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition \`${prc}\` not found.`)
          continue
        }
        const result = await ctx.call(
          harmonix as RuntimeHarmonix,
          async () => await precondition.callback(interaction)
        )

        if (!result) return
      }
    }
    ctm.callback(
      interaction,
      interaction instanceof MessageContextMenuCommandInteraction
        ? interaction.targetMessage
        : interaction.targetUser
    )
  })
}

export const registerButtons = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isButton()) return
    const btn = harmonix.client.components.buttons.get(interaction.customId)

    if (!btn) return
    btn.callback(interaction)
  })
}

export const registerModals = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return
    const mdl = harmonix.client.components.modals.get(interaction.customId)

    if (!mdl) return
    const inputs = Object.keys(mdl.config.inputs ?? {}).reduce<ParsedInputs>(
      (acc, input) => ({
        ...acc,
        [input]: interaction.fields.getTextInputValue(input)
      }),
      {}
    )

    mdl.callback(interaction, { inputs })
  })
}

export const registerSelectMenus = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isAnySelectMenu()) return
    const slm = harmonix.client.components.selectMenus.get(interaction.customId)

    if (!slm) return
    slm.callback(interaction, interaction.values)
  })
}

export const registerAutocomplete = (harmonix: RuntimeHarmonix) => {
  harmonix.client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isAutocomplete()) return
    const cmd = harmonix.client.commands.get(interaction.commandName)

    if (!cmd || !cmd.config.autocomplete) return
    try {
      await ctx.call(
        harmonix as RuntimeHarmonix,
        async () => await cmd.config.autocomplete!(interaction)
      )
    } catch (error: any) {
      createError(error.message)
    }
  })
}
