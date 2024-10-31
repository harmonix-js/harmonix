import type { C12InputConfig, ResolvedConfig } from 'c12'
import { Client, Collection, type ClientOptions } from 'discord.js'
import type { Hookable, NestedHooks } from 'hookable'
import type { ConsolaInstance } from 'consola'
import type { HarmonixCommand, HarmonixCommandInput } from './commands'
import type { HarmonixEvent, HarmonixEventInput } from './events'
import type {
  HarmonixContextMenu,
  HarmonixContextMenuInput
} from './context-menus'
import { HarmonixButton, HarmonixButtonInput } from './buttons'
import { HarmonixModal, HarmonixModalInput } from './modals'
import { HarmonixSelectMenu, HarmonixSelectMenuInput } from './select-menus'
import type {
  HarmonixPrecondition,
  HarmonixPreconditionInput
} from './preconditions'

interface HarmonixDirs {
  events: string
  commands: string
  contextMenus: string
  components: {
    dir: string
    buttons: string
    modals: string
    selectMenus: string
  }
  preconditions: string
}

interface RuntimeEnv {
  [key: string]: string | undefined
}

export interface HarmonixOptions {
  _config: HarmonixConfig
  _c12: ResolvedConfig<HarmonixConfig>

  rootDir: string
  srcDir: string
  scanDirs: string[]
  dirs: HarmonixDirs

  ignore: string[]

  hooks: NestedHooks<HarmonixHooks>

  events: HarmonixEventInput[]
  commands: HarmonixCommandInput[]
  contextMenus: HarmonixContextMenuInput[]
  components: {
    buttons: HarmonixButtonInput[]
    modals: HarmonixModalInput[]
    selectMenus: HarmonixSelectMenuInput[]
  }
  preconditions: HarmonixPreconditionInput[]

  client: ClientOptions
  clientId: string
  env: RuntimeEnv
}

type DeepPartial<T> =
  T extends Record<string, any>
    ? { [P in keyof T]?: DeepPartial<T[P]> | T[P] }
    : T

export interface HarmonixConfig
  extends DeepPartial<HarmonixOptions>,
    C12InputConfig<HarmonixConfig> {}

export interface HarmonixHooks {
  'bot:initialized': () => Promise<void> | void
  'bot:beforeRegister': () => Promise<void> | void
  'bot:registered': () => Promise<void> | void
  'bot:error': (error: any) => Promise<void> | void
}

export class HarmonixClient extends Client {
  public events: Collection<string, HarmonixEvent>
  public commands: Collection<string, HarmonixCommand>
  public contextMenus: Collection<string, HarmonixContextMenu>
  public preconditions: Collection<string, HarmonixPrecondition>
  public components: {
    buttons: Collection<string, HarmonixButton>
    modals: Collection<string, HarmonixModal>
    selectMenus: Collection<string, HarmonixSelectMenu>
  }

  constructor(options: ClientOptions) {
    super(options)

    this.events = new Collection()
    this.commands = new Collection()
    this.contextMenus = new Collection()
    this.preconditions = new Collection()
    this.components = {
      buttons: new Collection(),
      modals: new Collection(),
      selectMenus: new Collection()
    }
  }
}

export interface Harmonix {
  options: HarmonixOptions
  hooks: Hookable<HarmonixHooks>
  logger: ConsolaInstance
  client?: HarmonixClient
}

export interface RuntimeHarmonix extends Harmonix {
  client: HarmonixClient
}
