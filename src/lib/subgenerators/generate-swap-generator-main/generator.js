import isValid from 'is-valid-app'
import path from 'path'
import extend from 'extend'

import { task } from '../../utils/utils'
import Logger from '../../utils/Logger'

import generateDefaults from 'generate-defaults'

const log = new Logger('generate-swap-generator-main')

export default function (app) {
  if (!isValid(app, 'generate-swap-generator-main')) return

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
  app.task('main', ['set-default-githost', 'index-root', 'generator-root', 'generator-src', 'generator-test', 'plugin-test', 'template-example'])

  app.task('set-default-githost', done => {
    const githosts = app.base.data('githosts')
    const defaultHost = (githosts.length > 1) ? 'github.com' : githosts[0]
    app.base.data({defaultHost})
    done()
  })

  /**
   * Create the root index file
   *
   * ```sh
   * $ gen swap-main:index-root
   * ```
   * @name index-root
   * @api public
   */
  task(app, 'index-root', 'generate-swap-generator-main/index-root.js')

  /**
   * Create the root generator file
   *
   * ```sh
   * $ gen swap-main:generator-root
   * ```
   * @name generator-root
   * @api public
   */
  task(app, 'generator-root', 'generate-swap-generator-main/generator-root.js')

  /**
   * Create the src generator file
   *
   * ```sh
   * $ gen swap-main:generator-src
   * ```
   * @name generator-src
   * @api public
   */
  task(app, 'generator-src', 'generate-swap-generator-main/generator-src.js')

  /**
   * Create the test generator file
   *
   * ```sh
   * $ gen swap-main:generator-test
   * ```
   * @name generator-test
   * @api public
   */
  task(app, 'generator-test', 'generate-swap-generator-main/generator.test.js')

  /**
   * Create the test plugin file
   *
   * ```sh
   * $ gen swap-main:plugin-test
   * ```
   * @name plugin-test
   * @api public
   */
  task(app, 'plugin-test', 'generate-swap-generator-main/plugin.test.js')

  /**
   * Create the example template file (not rendered by swap-generator by by the generated generator)
   *
   * ```sh
   * $ gen swap-main:template-example
   * ```
   * @name template-example
   * @api public
   */
  app.task('template-example', done => {
    const opts = extend({}, app.base.options, app.options)
    const cwd = path.join(__dirname, '../../../../src/assets/templates/generate-swap-generator-main')
    const base = cwd
    const dest = opts.dest

    // copy template "<generator-dir>/src/assets/templates/generate-swap-generator-main/example.txt"
    // to "<cwd>/src/assets/templates/example.txt"
    // console.log({cwd, base, dest})
    // I don't understand why it works ignoring the "generate-swap-generator-main" folder but it does.
    app.src('example.txt', {cwd, base})
    .pipe(app.dest(dest))
    .on('finish', done)
    .on('error', done)
  })

  /**
   * Copy the lib files
   *
   * ```sh
   * $ gen swap-main:lib
   * ```
   * @name lib
   * @api public
   */
  app.task('libs', ['libs-utils-helpers', 'libs-utils-utils'])
  task(app, 'libs-utils-helpers', 'generate-swap-generator-main/libs-utils-helpers.js')
  task(app, 'libs-utils-utils', 'generate-swap-generator-main/libs-utils-utils.js')
  task(app, 'libs-tasks-prompt', 'generate-swap-generator-main/libs-tasks-prompt.js')
  task(app, 'libs-subgenerator-example', 'generate-swap-generator-main/libs-subgenerator-example.js')

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
