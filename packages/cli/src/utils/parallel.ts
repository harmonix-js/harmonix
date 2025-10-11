export const runParallel = async <T>(
  inputs: Set<T>,
  cb: (input: T) => unknown | Promise<unknown>,
  opts: { concurrency: number; interval?: number }
) => {
  const { concurrency, interval = 0 } = opts

  if (inputs.size === 0 || concurrency <= 0) return

  const iter = inputs.values()
  const sleep =
    interval > 0 ? (ms: number) => new Promise((r) => setTimeout(r, ms)) : null

  const worker = async () => {
    while (true) {
      const next = iter.next()

      if (next.done) return
      const item = next.value

      if (sleep) await sleep(interval)

      try {
        await cb(item)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const workers = Math.min(Math.max(1, Math.trunc(concurrency)), inputs.size)

  await Promise.all(Array.from({ length: workers }, worker))
}
