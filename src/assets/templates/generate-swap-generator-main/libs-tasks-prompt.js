---
layout: false
rename:
  basename: 'src/lib/tasks/prompt.js'
---
/**
 * Prompts for commonly used data. This task isn't necessary
 * needed, it's more of a convenience for asking questions up front,
 * instead of as files are generated.
 *
 * ```sh
 * $ gen project:prompt
 * ```
 * @name project:prompt
 * @api public
 */
export default app => {
  return done => {
    if (app.options.prompt === false) return done()

    app.base.data(app.cache.data)
    app.base.set('cache.prompted', true)

    app.on('answer', function (response, key, question, answers) {
      // console.log({response, key, question, answers})
    })

    let info1, info2, info3

    app.question('info1', {
      message: 'What is info #1 ?',
      default: 'default response to info 1'
    })
    askPromise(['info1'])
    .then(answers => {
      info1 = answers.info1
      app.base.data({info1})

      app.question('info2', {
        message: 'What is info #2 ?',
        default: info2
      })
      app.choices('info3', {
        message: 'What is correct answer for info3 ?',
        choices: ['A', 'B', 'C']
      })

      return askPromise(['info2', 'info3'])
    })
    .then(answers => {
      app.base.data(answers)

      // ask more questions where default answers depend of previous ones.
    })
    .then(() => done())
    .catch(err => done(err))
  }

  async function askPromise (keys) {
    return new Promise((resolve, reject) => {
      app.ask(keys, (err, answers) => {
        if (err) {
          reject(err)
        } else {
          resolve(answers)
        }
      })
    })
  }
}
