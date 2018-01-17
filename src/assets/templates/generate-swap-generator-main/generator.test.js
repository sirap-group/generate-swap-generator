---
layout: false
rename:
  basename: 'src/tests/generator.test.js'
---
import 'mocha'
import fs from 'fs'
import path from 'path'
import chai from 'chai'
import generate from 'generate'
import npm from 'npm-install-global'
import del from 'delete'

import pkg from '../../package'
import generator from '../lib/generator'

let app

const expect = chai.expect
const isCI = process.env.CI
const isTravis = isCI || process.env.TRAVIS
// const fixtures = path.resolve.bind(path, __dirname, 'fixtures')
const actual = path.resolve.bind(path, __dirname, 'actual')

describe('<%= packageName %>', function () {
  this.slow(250)

  if (isTravis) {
    this.timeout(4000)
  }

  if (!isCI && !isTravis) {
    before(function (cb) {
      npm.maybeInstall('generate', cb)
    })
  }

  beforeEach(function () {
    beforeEachTest(true, false)
  })

  afterEach(function (cb) {
    del(actual(), cb)
  })

  describe('tasks', function () {
    it('should extend tasks onto the instance', function () {
      app.use(generator)
      expect(app.tasks).has.property('default')
      expect(app.tasks).has.property('main')
    })

    it('should run the `default` task with .build', function (cb) {
      app.use(generator)
      app.build('default', exists('example.txt', cb))
    })

    it('should run the `default` task with .generate', function (cb) {
      app.use(generator)
      app.generate('default', exists('example.txt', cb))
    })
  })

  describe('<%= alias %> (CLI)', function () {
    it('should run the default task using the `<%= packageName %>` name (global install)', function (cb) {
      app.use(generator)
      app.generate('<%= packageName %>', exists('example.txt', cb))
    })

    it('should run the default task using the `<%= alias %>` generator alias (local generator.js)', function (cb) {
      app.use(generator)
      app.generate('project', exists('example.txt', cb))
    })
  })

  describe('<%= alias %> (API)', function () {
    it('should run the default task on the generator', function (cb) {
      app.register('<%= alias %>', generator)
      app.generate('<%= alias %>', exists('example.txt', cb))
    })

    it('should run the `<%= alias %>` task', function (cb) {
      app.register('<%= alias %>', generator)
      app.generate('<%= alias %>:project', exists('example.txt', cb))
    })

    it('should run the `default` task when defined explicitly', function (cb) {
      app.register('<%= alias %>', generator)
      app.generate('<%= alias %>:default', exists('example.txt', cb))
    })
  })

  describe('sub-generator', function () {
    it('should work as a sub-generator', function (cb) {
      app.register('foo', function (foo) {
        foo.register('<%= alias %>', generator)
      })
      app.generate('foo.<%= alias %>', exists('example.txt', cb))
    })

    it('should run the `default` task by default', function (cb) {
      app.register('foo', function (foo) {
        foo.register('<%= alias %>', generator)
      })
      app.generate('foo.<%= alias %>', exists('example.txt', cb))
    })

    it('should run the `generator:default` task when defined explicitly', function (cb) {
      app.register('foo', function (foo) {
        foo.register('<%= alias %>', generator)
      })
      app.generate('foo.<%= alias %>:default', exists('example.txt', cb))
    })

    it('should run the `generator:project` task when defined explicitly', function (cb) {
      app.register('foo', function (foo) {
        foo.register('<%= alias %>', generator)
      })
      app.generate('foo.<%= alias %>:project', exists('example.txt', cb))
    })

    it('should work with nested sub-generators', function (cb) {
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator)

      app.generate('foo.bar.baz', exists('example.txt', cb))
    })

    it('should run tasks as a sub-generator', function (cb) {
      beforeEachTest(true, true)
      const sub0 = app.register('sub0', generator)
      // eslint-disable-next-line no-unused-vars
      const sub1 = sub0.register('sub1', generator)
      app.generate('sub0.sub1:package', exists('example.txt', cb))
    })
  })

  function beforeEachTest (silent, cli) {
    app = generate({silent, cli})
    app.cwd = actual()

    app.option('prompt', false)
    app.option('check-directory', false)
    app.option('dest', actual())

    // see: https://github.com/jonschlinkert/ask-when
    app.option('askWhen', 'not-answered')

    app.data(pkg)
    app.data('project', pkg)

    // Set manually required values for template rendering without having to prompt the user
    app.data('foo', 'bar')
    app.data('foobar', 'baz')
  }
})

function exists (name, cb) {
  return function (err) {
    if (err) return cb(err)
    const filepath = actual(name)

    fs.stat(filepath, function (err, stat) {
      if (err) return cb(err)
      // eslint-disable-next-line no-unused-expressions
      expect(stat).to.exist
      del(actual(), cb)
    })
  }
}
