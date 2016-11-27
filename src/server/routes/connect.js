const confirm = require('confirmer')
const highlight = require('../../lib/highlight')
const auth = require('../../lib/auth')
const log = require('../../lib/log')
const parseUrl = require('../../lib/parse-url')
const scaffold = require('../../lib/scaffold')
const codeService = require('../../services/code')
const CWD = process.cwd()

module.exports = async function connect (req, res, next) {
  try {
    if (!req.body.url || !req.body.value) return nope(res)
    const {propertyId, experienceId} = parseUrl(req.body.url)
    await auth.set('COOKIE', req.body.value)
    const msg = `You recently navigated to ${highlight(req.body.url)}
  Would you like ${highlight('xp')} to scaffold your local project from this experiment? ${highlight('(y/n)')}`
    const yes = await confirm(msg)
    if (!yes) return
    const files = await codeService.get(propertyId, experienceId)
    await scaffold(CWD, files, false)
    log('All done!')
    process.exit()
  } catch (e) {
    log.error(e)
  }
  res.end()
}

function nope (res, msg) {
  return res.json({ message: 'not ready for this jelly' })
}
