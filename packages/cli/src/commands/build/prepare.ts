import fsp from 'node:fs/promises'

export const prepareDir = async (dir: string) => {
  await fsp.rm(dir, { recursive: true, force: true })
  await fsp.mkdir(dir, { recursive: true })
}
