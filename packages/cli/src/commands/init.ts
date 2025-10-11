import { defineCommand } from 'citty'
import { downloadTemplate } from 'giget'
import { installDependencies } from 'nypm'
import { hasTTY } from 'std-env'
import { resolve, relative } from 'pathe'
import { x } from 'tinyexec'
import { colors } from 'consola/utils'
import {
  cancel as _cancel,
  confirm,
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text
} from '@clack/prompts'

import { cwdArgs } from './_shared'
import { harmonixIcon, bgThemeColor } from '../utils/ascii'
import { logger } from '../utils/logger'

import type { SelectPromptOptions } from 'consola'
import type { PackageManagerName } from 'nypm'
import { existsSync } from 'node:fs'

const DEFAULT_REGISTRY =
  'https://raw.githubusercontent.com/harmonix-js/starter/templates/templates'
const DEFAULT_TEMPLATE_NAME = 'v1'

const cancel = () => {
  _cancel('Operation cancelled.')
  process.exit(0)
}

const pms: Record<PackageManagerName, undefined> = {
  npm: undefined,
  pnpm: undefined,
  yarn: undefined,
  bun: undefined,
  deno: undefined
}

const packageManagerOptions = Object.keys(pms) as PackageManagerName[]

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize a new Harmonix project'
  },
  args: {
    ...cwdArgs,
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: ''
    },
    template: {
      type: 'string',
      alias: 't',
      description: 'Template name'
    },
    force: {
      type: 'boolean',
      alias: 'f',
      description: 'Override existing directory'
    },
    install: {
      type: 'boolean',
      default: true,
      description: 'Skip installing dependencies'
    },
    gitInit: {
      type: 'boolean',
      description: 'Initialize git repository'
    },
    packageManager: {
      type: 'string',
      description: 'Package manager choice (npm, pnpm, yarn, bun)'
    }
  },
  async run({ args }) {
    if (hasTTY) {
      process.stdout.write(`\n${harmonixIcon}\n\n`)
    }

    intro(`${bgThemeColor}${colors.bold(' Welcome to Harmonix! ')}\u001B[0m`)

    if (args.dir === '') {
      const projectName = await text({
        message: 'Where would you like to create your project?',
        placeholder: './harmonix-bot',
        defaultValue: 'harmonix-bot',
        validate: (value) => {
          if (value.length === 0) return 'Project name cannot be empty.'
          if (value.includes(' ')) return 'Project name cannot contain spaces.'
        }
      }).then((v) => (isCancel(v) ? cancel() : v))

      args.dir = projectName
    }

    const cwd = resolve(args.cwd)
    let templateDownloadPath = resolve(cwd, args.dir)

    log.info(
      `Creating a new project in ${colors.cyan(relative(cwd, templateDownloadPath) || templateDownloadPath)}.`
    )

    const templateName = args.template || DEFAULT_TEMPLATE_NAME

    if (typeof templateName !== 'string') {
      log.error('Please specify a template!')
      process.exit(1)
    }

    let shouldForce = Boolean(args.force)
    const shouldVerify = !shouldForce && existsSync(templateDownloadPath)

    if (shouldVerify) {
      const selectedAction = await select({
        message: `The directory ${colors.cyan(templateDownloadPath)} already exists. What would you like to do?`,
        options: [
          { label: 'Override its contents', value: 'override' },
          { label: 'Select different directory', value: 'select' },
          { label: 'Abort', value: 'abort' }
        ]
      })

      switch (selectedAction) {
        case 'override': {
          shouldForce = true
          break
        }
        case 'select': {
          templateDownloadPath = resolve(
            cwd,
            await text({
              message: 'Please specify a different directory:'
            }).then((v) => (isCancel(v) ? cancel() : v))
          )
          break
        }
        default: {
          cancel()
        }
      }
    }

    const template = await downloadTemplate(templateName, {
      dir: templateDownloadPath,
      force: shouldForce,
      registry: DEFAULT_REGISTRY
    }).catch((error) => {
      log.error((error as Error).toString())
      process.exit(1)
    })

    const detectCurrentPackageManager = () => {
      const userAgent = process.env.npm_config_user_agent

      if (!userAgent) return
      const [name] = userAgent.split('/')

      if (packageManagerOptions.includes(name as PackageManagerName)) {
        return name as PackageManagerName
      }
    }

    const currentPackageManager = detectCurrentPackageManager()
    const packageManagerArg = args.packageManager as PackageManagerName
    const packageManagerSelectOptions = packageManagerOptions.map(
      (pm) =>
        ({
          label: pm,
          value: pm,
          hint: currentPackageManager === pm ? 'current' : undefined
        }) satisfies SelectPromptOptions['options'][number]
    )
    const selectedPackageManager = packageManagerOptions.includes(
      packageManagerArg
    )
      ? packageManagerArg
      : await select({
          message: 'Which package manager would you like to use?',
          options: packageManagerSelectOptions,
          initialValue: currentPackageManager
        }).then((v) => (isCancel(v) ? cancel() : v))

    if (args.install) {
      const s = spinner()

      s.start(
        `Installing dependencies via ${colors.cyan(selectedPackageManager)}...`
      )
      try {
        await installDependencies({
          cwd: template.dir,
          packageManager: {
            name: selectedPackageManager,
            command: selectedPackageManager
          },
          silent: true
        })
      } catch (error) {
        log.error((error as Error).toString())
        process.exit(1)
      }
      s.stop('Installation completed.')
    } else {
      log.info('Skipping install dependencies step.')
    }

    if (args.gitInit === undefined) {
      args.gitInit = await confirm({
        message: 'Initialize a git repository?'
      }).then((v) => (isCancel(v) ? cancel() : v))
    }

    if (args.gitInit) {
      log.step('Initializing git repository...')
      await x('git', ['init', template.dir], {
        throwOnError: true,
        nodeOptions: { stdio: 'inherit' }
      })
    }

    const relativeTemplateDir = relative(process.cwd(), template.dir) || '.'
    const runCmd = selectedPackageManager === 'deno' ? 'task' : 'run'
    const nextSteps = [
      relativeTemplateDir.length > 1 && `\`cd ${relativeTemplateDir}\``,
      `Invite your bot to your server using \`${selectedPackageManager} ${runCmd} invite\``,
      `Start development bot with \`${selectedPackageManager} ${runCmd} dev\``
    ].filter(Boolean)

    outro('✨ Harmonix project has been created. Next steps:')
    for (const step of nextSteps) {
      logger.log(` › ${step}\n`)
    }
  }
})
