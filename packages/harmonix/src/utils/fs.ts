import consola from 'consola'
import { getProperty } from 'dot-prop'
import { resolve } from 'pathe'

import type { HarmonixOptions } from '../types'

export const resolveHarmonixPath = (
  path: string,
  harmonixOptions: HarmonixOptions,
  base?: string
) => {
  path = compilePathTemplate(path)(harmonixOptions)

  return resolve(base || harmonixOptions.srcDir, path)
}

const compilePathTemplate = (template: string) => {
  return (params: Record<string, any>) =>
    template.replace(/{{ ?([\w.]+) ?}}/g, (_, match) => {
      const val = getProperty<Record<string, string>, string>(params, match)

      if (!val) {
        consola.warn(
          `cannot resolve template param '${match}' in '${template.slice(0, 20)}'`
        )
      }

      return val || `${match}`
    })
}
