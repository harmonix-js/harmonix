import { globby } from 'globby'
import { join, relative } from 'pathe'
import type { Harmonix } from './types'

const GLOB_SCAN_PATTERN = '**/*.{js,ts}'

export const scanAndSyncOptions = async (harmonix: Harmonix) => {
  const scannedEvents = await scanEvents(harmonix)
  harmonix.options.events = harmonix.options.events || []
  for (const evtPath of scannedEvents) {
    if (!harmonix.options.events.includes(evtPath)) {
      harmonix.options.events.push(evtPath)
    }
  }

  const scannedCommands = await scanCommands(harmonix)
  harmonix.options.commands = harmonix.options.commands || []
  for (const cmdPath of scannedCommands) {
    if (!harmonix.options.commands.includes(cmdPath)) {
      harmonix.options.commands.push(cmdPath)
    }
  }

  const scannedContextMenus = await scanContextMenus(harmonix)
  harmonix.options.contextMenus = harmonix.options.contextMenus || []
  for (const ctmPath of scannedContextMenus) {
    if (!harmonix.options.contextMenus.includes(ctmPath)) {
      harmonix.options.contextMenus.push(ctmPath)
    }
  }

  const scannedButtons = await scanButtons(harmonix)
  harmonix.options.components.buttons =
    harmonix.options.components.buttons || []
  for (const btnPath of scannedButtons) {
    if (!harmonix.options.components.buttons.includes(btnPath)) {
      harmonix.options.components.buttons.push(btnPath)
    }
  }

  const scannedModals = await scanModals(harmonix)
  harmonix.options.components.modals = harmonix.options.components.modals || []
  for (const mdlPath of scannedModals) {
    if (!harmonix.options.components.modals.includes(mdlPath)) {
      harmonix.options.components.modals.push(mdlPath)
    }
  }

  const scannedSelectMenus = await scanSelectMenus(harmonix)
  harmonix.options.components.selectMenus =
    harmonix.options.components.selectMenus || []
  for (const smPath of scannedSelectMenus) {
    if (!harmonix.options.components.selectMenus.includes(smPath)) {
      harmonix.options.components.selectMenus.push(smPath)
    }
  }

  const scannedPreconditions = await scanPreconditions(harmonix)
  harmonix.options.preconditions = harmonix.options.preconditions || []
  for (const prePath of scannedPreconditions) {
    if (!harmonix.options.preconditions.includes(prePath)) {
      harmonix.options.preconditions.push(prePath)
    }
  }
}

const scanEvents = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.events)

  return files.map((f) => f.fullPath)
}

const scanCommands = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.commands)

  return files.map((f) => f.fullPath)
}

const scanContextMenus = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.contextMenus)

  return files.map((f) => f.fullPath)
}

const scanButtons = async (harmonix: Harmonix) => {
  const buttonsDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.buttons
  )
  const files = await scanFiles(harmonix, buttonsDir)

  return files.map((f) => f.fullPath)
}

const scanModals = async (harmonix: Harmonix) => {
  const modalsDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.modals
  )
  const files = await scanFiles(harmonix, modalsDir)

  return files.map((f) => f.fullPath)
}

const scanSelectMenus = async (harmonix: Harmonix) => {
  const selectMenusDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.selectMenus
  )
  const files = await scanFiles(harmonix, selectMenusDir)

  return files.map((f) => f.fullPath)
}

const scanPreconditions = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.preconditions)

  return files.map((f) => f.fullPath)
}

const scanFiles = async (harmonix: Harmonix, name: string) => {
  const files = await Promise.all(
    harmonix.options.scanDirs!.map((dir) => scanDir(harmonix, dir, name))
  ).then((r) => r.flat())

  return files
}

const scanDir = async (harmonix: Harmonix, dir: string, name: string) => {
  const fileNames = await globby(join(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: harmonix.options.ignore,
    absolute: true
  })

  return fileNames
    .map((fullPath) => {
      return {
        fullPath,
        path: relative(join(dir, name), fullPath)
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}
