const confirm = require('confirmer')
const highlight = require('../../lib/highlight')
const auth = require('../../lib/auth')
const log = require('../../lib/log')
const parseUrl = require('../../lib/parse-url')
const experienceCode = require('../../services/experience-code')

module.exports = function connect (req, res, next) {
  if (!req.body.url || !req.body.value) return nope(res)
  let {domain, propertyId, experienceId} = parseUrl(req.body.url)
  return auth.set(domain, 'COOKIE', req.body.value).then(requestSync).then(() => res.end()).catch(next)

  function requestSync (codes) {
    let msg = `You recently navigated to ${highlight(req.body.url)}
Would you like ${highlight('xp')} to scaffold your local project from this experiment? ${highlight('(y/n)')}`
    return confirm(msg).then(result => {
      if (!result) return
      return experienceCode.writeToLocal(process.cwd(), domain, propertyId, experienceId)
        .then(() => log('All done!'))
        .then(process.exit)
    })
  }
}

function nope (res, msg) {
  return res.json({ message: 'not ready for this jelly' })
}
