import { defineCommand } from 'citty'
import { colors } from 'consola/utils'

import { rootDirArgs } from './_shared'
import { getAppId, resolveToken } from '../utils/auth'
import { fetch, routes } from '../utils/discord'
import { logger } from '../utils/logger'

import 'dotenv/config'

export default defineCommand({
  meta: {
    name: 'cleanup',
    description:
      'Clean up one or all commands (global or guild-specific) from Discord'
  },
  args: {
    ...rootDirArgs,
    token: {
      type: 'string',
      description: 'Bot token'
    },
    global: {
      type: 'boolean',
      description: 'Target application commands',
      default: false,
      alias: 'g'
    },
    guild: {
      type: 'string',
      description: 'Target guild-specific commands',
      valueHint: 'id'
    },
    name: {
      type: 'string',
      description: 'Name of a command to delete'
    },
    yes: {
      type: 'boolean',
      description: 'Skip confirmation prompts (non-interactive mode)',
      default: false
    }
  },
  async run({ args }) {
    const token = await resolveToken(args.cwd || args.rootDir, args.token)

    if (!token) {
      logger.error(
        `No bot token provided. Use the ${colors.bold('--token')} argument or set it in your harmonix config file.`
      )
      process.exit(1)
    }

    if (!args.global && !args.guild) {
      logger.error(
        `You must specify either ${colors.bold(
          '--global'
        )} or ${colors.bold('--guild <id>')}.`
      )
      process.exit(1)
    }

    if (args.global && args.guild) {
      logger.error(
        `Choose only one scoope: either ${colors.bold(
          '--global'
        )} or ${colors.bold('--guild <id>')}.`
      )
      process.exit(1)
    }

    const appId = await getAppId(token).catch(() => {
      logger.error(
        'Failed to fetch application from Discord. Please check your bot token.'
      )
      process.exit(1)
    })

    const { getAll, getSingle } = routes(appId, args.guild)

    if (args.name) {
      const commands = await fetch<Record<string, any>[]>(getAll(), {
        headers: { Authorization: `Bot ${token}` }
      })
      const target = commands.find((c) => c.name === args.name)

      if (!target) {
        logger.error(
          `No command ${colors.cyan(args.name)} found in the specified scope.`
        )
        process.exit(1)
      }

      if (!args.yes) {
        const confirm = await logger
          .prompt(
            `Delete command ${colors.cyan(target.name)} (${target.id}) from ${args.global ? 'global' : `your guild`}?`,
            { type: 'confirm', initial: false }
          )
          .catch(() => process.exit(1))

        if (!confirm) return logger.info('Operation cancelled.')
      }

      await fetch(getSingle(target.id), {
        headers: { Authorization: `Bot ${token}` },
        method: 'DELETE'
      })

      return logger.success(`Command ${colors.cyan(target.name)} deleted.`)
    }

    if (!args.yes) {
      const confirm = await logger.prompt(
        `Delete ALL ${args.global ? 'global' : 'guild-specific'} commands?`,
        { type: 'confirm', initial: false }
      )

      if (!confirm) return logger.info('Operation cancelled.')
    }

    await fetch(getAll(), {
      headers: { Authorization: `Bot ${token}` },
      method: 'PUT',
      body: []
    })

    logger.success(
      `All ${args.global ? 'global' : 'guild-specific'} commands deleted.`
    )
  }
})
