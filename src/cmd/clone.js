const _ = require('lodash')
const path = require('path')
const connect = require('../server/lib/connect')
const down = require('../services/down')
const scaffold = require('../lib/scaffold')
const parseUrl = require('../lib/parse-url')
const log = require('../lib/log')
const experienceFilename = require('../lib/experience-filename')
const {isUrl, isId} = require('../lib/is-type')
const CWD = process.cwd()

module.exports = async function pull (id) {
  try {
    let propertyId, experienceId
    let opts = arguments[arguments.length - 1].parent.args.slice(0, -1)

    if (opts.length && _.every(opts, isId)) {
      [propertyId, experienceId] = opts.map(Number)
    } else if (opts.length && isUrl(id)) {
      ({propertyId, experienceId} = parseUrl(id))
    }
    let experience, files
    if (propertyId && experienceId) {
      ({experience, files} = await down(propertyId, experienceId))
    } else {
      ({experience, files} = await connect())
    }

    log(`cloning experience`)
    let filename = experienceFilename(experience)
    let dest = path.join(CWD, filename)
    await scaffold(dest, files, false, true)
    log(`cloned into ${filename}`)
  } catch (err) {
    log.error(err)
  }
}
