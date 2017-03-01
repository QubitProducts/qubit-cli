const _ = require('lodash')
const connect = require('../server/lib/connect')
const template = require('./template')
const down = require('../services/down')
const getPkg = require('../lib/get-pkg')
const scaffold = require('../lib/scaffold')
const parseUrl = require('../lib/parse-url')
const mergePkg = require('../lib/merge-pkg')
const log = require('../lib/log')
const {isName, isUrl, isId} = require('../lib/is-type')
const CWD = process.cwd()

module.exports = async function pull (id) {
  let pkg
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
      pkg = await getPkg()
      // try to get from package.json and fallback on connect route
      ;({propertyId, experienceId} = (pkg.meta || {}))
    }

    let files
    if (propertyId && experienceId) {
      ({files} = await down(propertyId, experienceId))
    } else {
      ({files} = await connect())
    }

    if (pkg.meta) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)

    log(`pulling`)
    return scaffold(CWD, files, false, true)
  } catch (err) {
    log.error(err)
  }
}
