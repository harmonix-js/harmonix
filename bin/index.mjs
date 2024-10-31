#!/usr/bin/env node

import { initHarmonix } from '../dist/index.mjs'
import 'dotenv/config'

process.env.NODE_ENV = 'development'

const init = async () => {
  await initHarmonix({ rootDir: './playground' }, { cwd: './playground' })
}

init()
