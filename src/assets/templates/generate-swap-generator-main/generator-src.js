---
layout: false
rename:
  basename: 'src/lib/generator.js'
---
import isValid from 'is-valid-app'

import Logger from './utils/Logger'
import { task } from './utils/utils'

import generateDefaults from 'generate-defaults'
import generateDest from 'generate-dest'

import promptTask from './tasks/prompt'

const log = new Logger('<%= ask('name') %>')

export default function (app) {
  if (!isValid(app, '<%= ask('name') %>')) return

  app.on('error', ::log.error)

  /**
   * Use Plugins
   */
  app.use(generateDefaults)

  /**
   * Register Sub Generators
   */
  app.register('destination-directory', generateDest)

  /**
   * Run main task <%= alias %>. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen <%= alias %>:main
   * ```
   * @name main
   * @api public
   */
  app.task('main', function (cb) {
    app.generate([
      'prompt',
      'dest',
      'example'
    ], cb)
  })

  /**
   * Ask the user for all the required data for all the tasks in this generator.
   *
   * ```sh
   * $ gen <%= alias %>:prompt
   * ```
   * @name prompt
   * @api public
   */
  app.task('prompt', promptTask(app))

  /**
   * Set the destination directory for generated files.
   * Call the `destination-directory:default` task from the sub generator `destination-directory`.
   *
   * ```sh
   * $ gen <%= alias %>:dest
   * ```
   * @name dest
   * @api public
   */
  app.task('dest', function (cb) {
    app.generate(['destination-directory:default'], cb)
  })

  /**
   * Define the example task
   *
   * ```sh
   * $ gen <%= alias %>:example
   * ```
   * @name dest
   * @api public
   */
  task(app, 'example', 'example.txt')

  /**
   * Run the default task
   *
   * ```sh
   * $ gen <%= alias %>:default
   * ```
   *
   * or simply
   *
   * ```sh
   * $ gen <%= alias %>
   * ```
   * @name default
   * @api public
   */
  app.task('default', ['main'])
}
