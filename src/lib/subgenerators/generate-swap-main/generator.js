import isValid from 'is-valid-app'

import { task } from '../../utils/utils'
import Logger from '../../utils/Logger'

import generateDefaults from 'generate-defaults'

const log = new Logger('generate-swap-main')

export default function (app) {
  if (!isValid(app, 'generate-swap-main')) return

  app.on('error', ::log.error)

  app.use(generateDefaults)

  /**
   * Write the following three files to the current working directory:
   * - ./index.js
   * - ./src/lib/index.js
   * - ./src/tests/index.test.js
   *
   * ```sh
   * $ gen swap-main:main
   * ```
   * @name main
   * @api public
   */
  app.task('main', ['index-root', 'generator-root', 'generator-src', 'generator-test', 'plugin-test'])

  /**
   * Create the root index file
   *
   * ```sh
   * $ gen swap-main:index-root
   * ```
   * @name index-root
   * @api public
   */
  task(app, 'index-root', 'generate-swap-main/index-root.js')

  /**
   * Create the root generator file
   *
   * ```sh
   * $ gen swap-main:generator-root
   * ```
   * @name generator-root
   * @api public
   */
  task(app, 'generator-root', 'generate-swap-main/generator-root.js')

  /**
   * Create the src generator file
   *
   * ```sh
   * $ gen swap-main:generator-src
   * ```
   * @name generator-src
   * @api public
   */
  task(app, 'generator-src', 'generate-swap-main/generator-src.js')

  /**
   * Create the test generator file
   *
   * ```sh
   * $ gen swap-main:generator-test
   * ```
   * @name generator-test
   * @api public
   */
  task(app, 'generator-test', 'generate-swap-main/generator-test.js')

  /**
   * Create the test plugin file
   *
   * ```sh
   * $ gen swap-main:plugin-test
   * ```
   * @name plugin-test
   * @api public
   */
  task(app, 'plugin-test', 'generate-swap-main/plugin-test.js')

  /**
   * Run the `default` task
   *
   * ```sh
   * $ gen swap-main
   * ```
   *
   * or
   *
   * ```sh
   * $ gen swap-main:default
   * ```
   *
   * @name default
   * @api public
   */
  app.task('default', ['main'])
}
