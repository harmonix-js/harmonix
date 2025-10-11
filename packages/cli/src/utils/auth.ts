import { fetch } from './discord'
import { loadOptions } from 'harmonix'
import { isEnvRef, resolveEnvRef } from '../../../harmonix/src/config/env'

export const resolveToken = async (dir: string, cliToken?: string) => {
  const options = await loadOptions({ rootDir: dir })
  let token = cliToken || options.token

  if (isEnvRef(token)) {
    token = resolveEnvRef(token)!
  }

  return token
}

export const getAppId = async (token: string): Promise<string> => {
  const { bot } = await fetch('/oauth2/applications/@me', {
    headers: { Authorization: `Bot ${token}` }
  })

  return bot.id
}
