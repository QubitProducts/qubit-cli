const confirm = require('confirmer')
const highlight = require('../../lib/highlight')
const auth = require('../../lib/auth')
const log = require('../../lib/log')
const parseUrl = require('../../lib/parse-url')
const scaffold = require('../../lib/scaffold')
const codeService = require('../../services/code')
const createApp = require('../app')
const CWD = process.cwd()

module.exports = async function connect () {
  let app = await createApp()
  await app.start()

  return new Promise((resolve, reject) => {
    log('navigate to an `experience` page to scaffold your experience from it')
    app.post('/connect', async (req, res) => {
      res.set('Connection', 'close')
      res.end()
      if (!req.body.url || !req.body.value) return log.error('request to /connect endpoint received with no params')
      const {propertyId, experienceId} = parseUrl(req.body.url)
      await auth.set('COOKIE', req.body.value)
      const msg = `You recently navigated to ${highlight(req.body.url)}\n` +
      `Would you like ${highlight('xp')} to scaffold your local project from this experiment? ${highlight('(y/n)')}`
      const yes = await confirm(msg)
      if (!yes) return
      const files = await codeService.get(propertyId, experienceId)
      await scaffold(CWD, files, false)
      await app.stop()
      resolve()
    })
  })
}
