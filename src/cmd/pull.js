const _ = require('lodash')
const connect = require('../server/lib/connect')
const template = require('./template')
const down = require('../services/down')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const parseUrl = require('../lib/parse-url')
const log = require('../lib/log')
const {isName, isUrl, isId} = require('../lib/is-type')
const CWD = process.cwd()

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
      ({propertyId, experienceId} = ((await getPkg()).meta || {}))
    }

    let files
    if (propertyId && experienceId) {
      ({files} = await down(propertyId, experienceId))
    } else {
      ({files} = await connect())
    }

    return scaffold(CWD, files, false, true)
  } catch (err) {
    log.error(err)
  }
}
