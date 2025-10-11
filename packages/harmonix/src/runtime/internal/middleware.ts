import type { GuardFn, Middleware } from '../../types/runtime/pipeline'

export const createMiddleware = (fn: Middleware) => fn
export const createGuard = (fn: GuardFn) =>
  createMiddleware(async (interaction, next) => {
    const ok = await fn(interaction)

    if (ok === false) return

    await next()
  })
