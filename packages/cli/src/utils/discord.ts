import { $fetch } from 'ofetch'

import type { FetchOptions } from 'ofetch'

export const fetch = <T = any>(path: string, opts: FetchOptions = {}) => {
  return $fetch<T>(path, {
    baseURL: 'https://discord.com/api',
    method: opts.method || 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'harmonix',
      ...opts.headers
    },
    query: opts.query,
    body: opts.body
  })
}

export const routes = (appId: string, guildId?: string) => {
  const base = guildId
    ? `/applications/${appId}/guilds/${guildId}/commands`
    : `/applications/${appId}/commands`

  return {
    getAll: () => base,
    getSingle: (cmdId: string) => `${base}/${cmdId}`
  }
}
