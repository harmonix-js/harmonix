import { fileURLToPath } from 'node:url'

export const resolveEntry = (path: string, url: string) => {
  if (path.startsWith('.')) {
    return fileURLToPath(new URL(path, url))
  }

  return path
}
