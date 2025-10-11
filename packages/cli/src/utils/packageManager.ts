import { execSync } from 'node:child_process'

export const getPackageManagerVersion = (name: string) => {
  return execSync(`${name} --version`, { encoding: 'utf8' }).trim()
}
