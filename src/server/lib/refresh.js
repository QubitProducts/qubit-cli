const createApp = require('../app')
const auth = require('../../lib/auth')
const log = require('../../lib/log')

module.exports = async function refresh () {
  let app = await createApp()
  await app.start()
  return await new Promise((resolve, reject) => {
    log('navigate to an `edit experience` page to refresh your authorization token')
    app.post('/connect', async (req, res) => {
      res.set('Connection', 'close')
      res.end()
      if (!req.body.value) return log.error('request to /connect endpoint received with no params')
      await auth.set('COOKIE', req.body.value)
      await app.stop()
      resolve()
    })
  })
}
