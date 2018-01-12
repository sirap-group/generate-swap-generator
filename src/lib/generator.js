import isValid from 'is-valid-app'

import Logger from './utils/Logger'
// import { task } from './utils/utils'

import generateDefaults from 'generate-defaults'
import generateGit from 'generate-git'
import generateSwapProject from 'generate-swap-project'

import generatePackage from './subgenerators/generate-swap-package/generator'
import generateMain from './subgenerators/generate-swap-main/generator'
import generateReadme from './subgenerators/generate-swap-readme/generator'

// import promptTask from './tasks/prompt'

const log = new Logger('generate-swap-generator')

export default function (app) {
  if (!isValid(app, 'generate-swap-generator')) return

  app.on('error', ::log.error)

  /**
   * Plugins
   */
  app.use(generateDefaults)
  app.use(generateSwapProject)

  /**
   * Micro generators (as plugins)
   */
  app.register('git', generateGit)
  app.register('package', generatePackage)
  app.register('main', generateMain)
  app.register('readme', generateReadme)

  /**
   * Scaffold out a swap-generator project using most of the swap-project plugin's tasks and the overriden tasks defined in this generator using local sub-generators. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen swap-generator:project
   * ```
   * @name project
   * @api public
   */
  app.task('project', function (cb) {
    app.generate([
      // from swap-project plugin
      'prompt',
      'dest',

      // overriden by swap-generator-package local sub-generator
      'package',

      // from swap-project plugin
      'gitignore',
      'gitattributes',
      'editorconfig',
      'npmrc',
      'contributing',
      'license',

      // overriden by swap-generator-main local sub-generator
      'main',

      // overriden by swap-generator-readme local sub-generator
      'readme',

      // from swap-project plugin
      'travis',
      'gitlabci',

      // from git sub-generator
      'git:default'
    ], cb)
  })

  /**
   * Create swap-generator:package task using swap-generator-package local subgenerator overriding the swap-project:package task
   *
   * ```sh
   * $ gen swap-generator:package
   * ```
   * @name package
   * @api public
   */
  app.task('package', function (cb) {
    app.generate([ 'swap-generator-package:default' ], cb)
  })

  /**
   * Create swap-generator:main task using swap-generator-main local subgenerator overriding the swap-project:main task
   *
   * ```sh
   * $ gen swap-generator:main
   * ```
   * @name main
   * @api public
   */
  app.task('main', function (cb) {
    app.generate([ 'swap-generator-main:default' ], cb)
  })

  /**
   * Create swap-generator:readme task using swap-generator-readme local subgenerator overriding the swap-project:readme task
   *
   * ```sh
   * $ gen swap-generator:readme
   * ```
   * @name readme
   * @api public
   */
  app.task('readme', function (cb) {
    app.generate([ 'swap-generator-readme:default' ], cb)
  })

  /**
   * Scaffold out a new swap-generator project. This task is an alias for the [swap-generator](#swap-generator)
   * task, to allow running this generator with the following command:
   *
   * ```sh
   * $ gen swap-generator:default
   * ```
   *
   * or simply
   *
   * ```sh
   * $ gen swap-generator
   * ```
   * @name default
   * @api public
   */
  app.task('default', ['project'])
}
