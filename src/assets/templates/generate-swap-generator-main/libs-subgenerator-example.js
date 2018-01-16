---
layout: false
rename:
  basename: 'src/lib/subgenerators/generate-subgenerator-example/generator.js'
---
import isValid from 'is-valid-app'
import helperDate from 'helper-date'

import { task } from '../../utils/utils'
import { escapeQuotes } from '../../utils/helpers'
import Logger from '../../utils/Logger'

import generateDefaults from 'generate-defaults'

const log = new Logger('generate-swap-generator-package')

export default function (app) {
  if (!isValid(app, 'generate-swap-generator-package')) return

  app.on('error', ::log.error)

  app.helper('date', helperDate)
  app.helper('escapeQuotes', escapeQuotes)

  app.use(generateDefaults)

  /**
   * Write a `example-subgenerator.txt` file to the current working directory.
   *
   * ```sh
   * $ gen subgenerator-example
   * ```
   * @name file
   * @api public
   */
  task(app, 'example-subgenerator', 'generate-subgenerator-example/example-subgenerator.txt')

  /**
   * Run the `example-subgenerator` task
   *
   * ```sh
   * $ gen example-subgenerator
   * ```
   *
   * or
   *
   * ```sh
   * $ gen example-subgenerator:default
   * ```
   *
   * @name file
   * @api public
   */
  app.task('default', ['example-subgenerator'])
}
