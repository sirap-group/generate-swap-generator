import isValid from 'is-valid-app'

import Logger from './utils/Logger'
// import { task } from './utils/utils'

import generateDefaults from 'generate-defaults'
import generateDest from 'generate-dest'
import generateGit from 'generate-git'

// import generatePackage from './subgenerators/generate-swap-package/generator'
// import generateGitignore from './subgenerators/generate-swap-gitignore/generator'
// import generateGitattributes from './subgenerators/generate-swap-gitattributes/generator'
// import generateEditorconfig from './subgenerators/generate-swap-editorconfig/generator'
// import generateNpmrc from './subgenerators/generate-swap-npmrc/generator'
// import generateContributing from './subgenerators/generate-swap-contributing/generator'
// import generateLicense from './subgenerators/generate-swap-license/generator'
// import generateMain from './subgenerators/generate-swap-main/generator'
// import generateReadme from './subgenerators/generate-swap-readme/generator'
// import generateTravis from './subgenerators/generate-swap-travis/generator'
// import generateGitlabci from './subgenerators/generate-swap-gitlabci/generator'

import promptTask from './tasks/prompt'

const log = new Logger('generate-swap-generator')

export default function (app) {
  if (!isValid(app, 'generate-swap-generator')) return

  app.on('error', ::log.error)

  /**
   * Plugins
   */
  app.use(generateDefaults)

  /**
   * Micro generators (as plugins)
   */
  app.register('destination-directory', generateDest)
  app.register('git', generateGit)
  // app.register('package', generatePackage)
  // app.register('gitignore', generateGitignore)
  // app.register('gitattributes', generateGitattributes)
  // app.register('editorconfig', generateEditorconfig)
  // app.register('npmrc', generateNpmrc)
  // app.register('contributing', generateContributing)
  // app.register('license', generateLicense)
  // app.register('main', generateMain)
  // app.register('readme', generateReadme)
  // app.register('travis', generateTravis)
  // app.register('gitlabci', generateGitlabci)

  /**
   * Scaffold out a(n) swap-project project.
   *
   * ```sh
   * $ gen swap-generator:project
   * ```
   * @name project
   * @api public
   */
  app.task('project', function (cb) {
    app.generate([
      'swap-project:prompt',
      'swap-project:dest',
      'swap-project:package',
      'swap-project:gitignore',
      'swap-project:gitattributes',
      'swap-project:editorconfig',
      'swap-project:npmrc',
      'swap-project:contributing',
      'swap-project:license',
      'swap-project:main',
      'swap-project:readme',
      'swap-project:travis',
      'swap-project:gitlabci',
      'git:default'
    ], cb)
  })

  /**
   * Change a swap-project to a swap-generator. Also aliased as the [default](#default) task.
   *
   * ```sh
   * $ gen swap-generator:project
   * ```
   * @name project
   * @api public
   */

  app.task('generator', function (cb) {
    app.generate([
      'project',
      'package',
      'main',
      'readme'
      // 'git:default'
    ], cb)
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
  app.task('default', ['generator'])
}
