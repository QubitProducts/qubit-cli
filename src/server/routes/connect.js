const url = require('url')
const confirm = require('confirmer')
const chalk = require('chalk')
const auth = require('../../lib/auth')
const experienceCode = require('../../services/experience-code')

module.exports = function connect (req, res, next) {
  if (!req.body.url || !req.body.value) return nope(res)
  let ids = req.body.url.match(/\d+/g).map(Number)
  if (ids.length < 3) return nope(res)
  let uri = url.parse(req.body.url)
  let [propertyId, experienceId] = ids
  let domain = uri.protocol + '//' + uri.hostname
  return auth.set(domain, 'COOKIE', req.body.value).then(requestSync).then(() => res.end()).catch(next)

  function requestSync (codes) {
    let msg = `You recently navigated to ${chalk.green.bold(req.body.url)}
Would you like ${chalk.green.bold('xp')} to scaffold your local project from this experiment? ${chalk.green.bold('(y/n)')}`
    return confirm(msg).then(result => {
      if (!result) return
      console.log(process.cwd(), domain, propertyId, experienceId)
      return experienceCode.down(process.cwd(), domain, propertyId, experienceId).then(process.exit)
    })
  }
}

function nope (res, msg) {
  return res.json({ message: 'not ready for this jelly' })
}
