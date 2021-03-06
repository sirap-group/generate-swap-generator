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

  app.postRender(/package\.json$/, packagePostRender(app))
  app.postRender(/release\.js$/, gulpReleasePostRender(app))

  app.use(generateDefaults)

  /**
   * Write a `package.json` file to the current working directory.
   *
   * ```sh
   * $ gen swap-package:package
   * ```
   * @name file
   * @api public
   */
  task(app, 'package', 'generate-swap-generator-package/$package.json')

  /**
   * Write a `release.js` file to the `scripts/gulp-tasks/` directory.
   *
   * ```sh
   * $ gen swap-package:gulp-release
   * ```
   * @name gulp-release
   * @api public
   */
  task(app, 'gulp-release', 'generate-swap-generator-package/gulp-tasks/release.js')

  /**
   * Write a `watch.js` file to the `scripts/gulp-tasks/` directory.
   *
   * ```sh
   * $ gen swap-package:gulp-watch
   * ```
   * @name gulp-watch
   * @api public
   */
  task(app, 'gulp-watch', 'generate-swap-generator-package/gulp-tasks/watch.js')

  /**
   * Run the `package` task
   *
   * ```sh
   * $ gen swap-project
   * ```
   *
   * or
   *
   * ```sh
   * $ gen swap-project:default
   * ```
   *
   * @name file
   * @api public
   */
  app.task('default', ['package', 'gulp-release', 'gulp-watch'])
}

function packagePostRender (app) {
  return (file, next) => {
    if (!file.basename === 'package.json') {
      next()
      return
    }

    // Load the package a an object
    const pkg = JSON.parse(file.content)

    // Set the package private if --private
    if (app.options.private) {
      pkg.private = true
    }

    // Format package.json#files as an array
    pkg.files = pkg.files.split(',')
    // Format package.json#keywords as an array
    pkg.keywords = pkg.keywords.split(',')

    file.contents = Buffer.from(JSON.stringify(pkg, null, 2))
    next()
  }
}

function gulpReleasePostRender (app) {
  return (file, next) => {
    if (!file.basename === 'release.js') {
      const errMsg = `File basename (${file.basename}) doesnt match release.js`
      app.log.error(errMsg)
      next(errMsg)
      return
    }

    let contents
    try {
      contents = String(file.contents)
      contents = contents.replace(/#{/g, '${')
      file.contents = Buffer.from(contents)
    } catch (err) {
      app.log.error('release.js post-render hook failed!')
      next(err)
    }

    next()
  }
}
