const _ = require('lodash')
const connect = require('../server/lib/connect')
const template = require('./template')
const down = require('./down')
const getPkg = require('../lib/get-pkg')
const parseUrl = require('../lib/parse-url')
const log = require('../lib/log')

module.exports = async function pull (id) {
  try {
    let propertyId, experienceId
    let opts = arguments[arguments.length - 1].parent.args.slice(0, -1)

    if (opts.length && _.every(opts, isId)) {
      [propertyId, experienceId] = opts.map(Number)
    } else if (opts.length && isUrl(id)) {
      ({propertyId, experienceId} = parseUrl(id))
    } else if (opts.length && isName(id)) {
      // scaffold from template
      return template(id)
    } else if (!opts.length) {
      // try to get from package.json and fallback on connect route
      try {
        ({propertyId, experienceId} = (await getPkg()).meta)
      } catch (err) {}
    }

    if (propertyId && experienceId) return await down(propertyId, experienceId)
    return await connect()
  } catch (err) {
    log.error(err)
  }
}

function isName (str) {
  return /^[\w-]+$/.test(String(str))
}

function isUrl (str) {
  return /^http/.test(String(str))
}

function isId (str) {
  return /^\d+/.test(String(str))
}
