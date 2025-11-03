import type { CommandInteraction } from 'discord.js'

import type { Middleware } from './types/runtime/pipeline'

const compose = (middlewares: Middleware[]) => {
  return async (
    interaction: CommandInteraction,
    next?: () => Promise<void>
  ) => {
    let index = -1
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) throw new Error('next() called multiple times')

      index = i
      const fn = middlewares[i] ?? next

      if (!fn) return

      await fn(interaction, () => dispatch(i + 1))
    }

    await dispatch(0)
  }
}

export const runPipeline = async (
  interaction: CommandInteraction,
  middlewares: Middleware[] | undefined,
  runner: (interaction: CommandInteraction) => Promise<void>
) => {
  const chain: Middleware[] = [
    ...(middlewares ?? []),
    async (i, next) => {
      await runner(i)
      await next()
    }
  ]

  await compose(chain)(interaction)
}
