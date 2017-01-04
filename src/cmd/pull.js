const _ = require('lodash')
const connect = require('./connect')
const template = require('./template')
const down = require('./down')
const getPkg = require('../lib/get-pkg')
const parseUrl = require('../lib/parse-url')

module.exports = async function pull (id) {
  let opts = arguments[arguments.length - 1].parent.args.slice(0, -1)

  if (opts.length && _.every(opts, isId)) {
    let [propertyId, experienceId] = opts.map(Number)
    return down(propertyId, experienceId)
  }

  if (opts.length && isUrl(id)) {
    let url = id
    let {experienceId, propertyId} = parseUrl(url)
    return down(propertyId, experienceId)
  }

  // scaffold from template
  if (opts.length && isName(id)) {
    return template(id)
  }

  // try to get from package.json and fallback on connect route
  if (!opts.length) {
    let propertyId, experienceId
    try {
      const pkg = await getPkg()
      propertyId = pkg.meta.propertyId
      experienceId = pkg.meta.experienceId
    } catch (err) {}
    if (!propertyId || !experienceId) return connect()
    return down(propertyId, experienceId)
  }
}

function isName (str) {
  return /^\w+$/.test(String(str))
}

function isUrl (str) {
  return /^http/.test(String(str))
}

function isId (str) {
  return /^\d+/.test(String(str))
}
