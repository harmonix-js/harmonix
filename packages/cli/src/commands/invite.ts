import { defineCommand } from 'citty'
import { colors } from 'consola/utils'
import clipboardy from 'clipboardy'
import open from 'open'
import { isMinimal } from 'std-env'

import 'dotenv/config'

import { rootDirArgs } from './_shared'
import { PermissionFlagsBits } from '../utils/permissions'
import { getAppId, resolveToken } from '../utils/auth'
import { logger } from '../utils/logger'

export default defineCommand({
  meta: {
    name: 'invite',
    description: 'Generate a Discord invite link to add the bot to a server'
  },
  args: {
    ...rootDirArgs,
    id: {
      type: 'string',
      description: 'Bot ID'
    },
    open: {
      type: 'boolean',
      alias: 'o',
      description: 'Open the invite link in the default browser'
    }
  },
  async run({ args }) {
    let id: string
    const token = await resolveToken(args.cwd || args.rootDir)

    if (args.id) {
      id = args.id
    } else if (token) {
      id = await getAppId(token).catch(() => {
        logger.error('Failed to fetch application from Discord.')
        process.exit(1)
      })
    } else {
      logger.error(
        `Cannot resolve bot ID from config. Provide the bot ID using the ${colors.bold('--id')} argument.`
      )
      process.exit(1)
    }

    const permissions = await logger.prompt('Choose bot permissions.', {
      type: 'multiselect',
      options: Object.keys(
        PermissionFlagsBits
      ) as (keyof typeof PermissionFlagsBits)[],
      initial: ['Administrator']
    })
    const bitPermissions = permissions.includes('Administrator')
      ? PermissionFlagsBits.Administrator
      : permissions.reduce((acc, key) => acc + PermissionFlagsBits[key], 0n)
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${id}&permissions=${bitPermissions}&scope=bot`
    const copied =
      !isMinimal &&
      (await clipboardy
        .write(inviteLink)
        .then(() => true)
        .catch(() => false))

    logger.success('Invite link generated')
    if (args.open) {
      logger.info('Opening invite link...')
      await open(inviteLink).catch(() =>
        logger.error('Failed to open invite link')
      )
    } else {
      logger.info(
        `${colors.bold(inviteLink)}${copied ? ' (copied to clipboard)' : ''}`
      )
    }
  }
})
