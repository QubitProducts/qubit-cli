const confirm = require('confirmer')
const highlight = require('../../lib/highlight')
const log = require('../../lib/log')
const parseUrl = require('../../lib/parse-url')
const createApp = require('../app')

module.exports = async function connect () {
  let app = await createApp()
  await app.start()

  return new Promise((resolve) => {
    log.info('Navigate to an `experience` page to scaffold your experience from it')
    app.post('/connect', async (req, res) => {
      res.end()
      if (!req.body.url) return log.error('Request to /connect endpoint received with no params')
      const {propertyId, experienceId} = parseUrl(req.body.url)
      const msg = `You recently navigated to ${highlight(req.body.url)}\n` +
      `Would you like ${highlight('Qubit-CLI')} to scaffold your local project from this experiment? ${highlight('(y/n)')}`
      const yes = await confirm(msg)
      if (!yes) return
      await app.stop()
      resolve({propertyId, experienceId})
    })
  })
}
