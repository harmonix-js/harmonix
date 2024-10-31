import { APIApplicationCommand, REST, Routes } from 'discord.js'
import { Harmonix, HarmonixClient, RuntimeHarmonix } from './types'
import 'dotenv/config'
import { createError, ctx } from './harmonix'
import { toJSON } from './utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  try {
    const client = new HarmonixClient(harmonixOptions.client)

    client.login(process.env.DISCORD_CLIENT_TOKEN)

    return client
  } catch (error: any) {
    createError(error.message)
  }
}

export const refreshApplicationCommands = async (harmonix: RuntimeHarmonix) => {
  const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN!)

  harmonix.client.once('ready', async (client) => {
    try {
      const commands = [
        ...harmonix.client.commands.values(),
        ...harmonix.client.contextMenus.values()
      ]
      harmonix.logger.info('Started refreshing application commands.')
      const apiCommands = (await rest.put(
        Routes.applicationCommands(harmonix.options.clientId || client.user.id),
        {
          body: commands.map((cmd) => toJSON(cmd))
        }
      )) as APIApplicationCommand[]

      harmonix.logger.info('Syncing commands with API.')
      for (const cmd of commands) {
        const command = apiCommands.find((c) => c.name === cmd.config.name)

        if (!command) {
          harmonix.logger.warn(
            `Command \`${cmd.config.name}\` not found in API.`
          )
          continue
        }
        cmd.config.id = command.id
      }
      harmonix.logger.success('Successfully loaded application commands.\n')
      const readyEvents = harmonix.client.events.filter(
        (event) => event.config.name === 'ready'
      )

      if (readyEvents.size > 0) {
        for (const [, readyEvent] of readyEvents) {
          ctx.call(harmonix as RuntimeHarmonix, () =>
            readyEvent.callback(client)
          )
        }
      }
    } catch (error: any) {
      createError(error.message)
    }
  })
}
