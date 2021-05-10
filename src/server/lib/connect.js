const confirm = require('confirmer')
const config = require('../../../config')
const log = require('../../lib/log')
const parseUrl = require('../../lib/parse-url')
const formatLog = require('../../lib/format-log')
const createApp = require('../app')

module.exports = async function connect () {
  const app = await createApp()
  await app.start()
  log.info(`Qubit-CLI listening on port ${config.port}`)

  return new Promise(resolve => {
    log.info(
      'Navigate to an `experience` page to scaffold your experience from it'
    )
    app.post('/connect', async (req, res) => {
      res.end()
      if (!req.body.url) { return log.error('Request to /connect endpoint received with no params') }
      const { propertyId, experienceId } = parseUrl(req.body.url)
      const msg =
        `You recently navigated to ${req.body.url}\n` +
        'Would you like Qubit-CLI to scaffold your local project from this experiment? (y/n)'
      const yes = await confirm(formatLog(msg))
      if (!yes) return
      await app.stop()
      resolve({ propertyId, experienceId })
    })
  })
}
