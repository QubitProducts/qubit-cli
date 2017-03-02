const _ = require('lodash')
const log = require('./log')
module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn) {
  globalFn()
  log.info('starting activation')
  if (triggerFn(_.cloneDeep(options), activate) === true) execute()

  function activate (pass) {
    const shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      log.info('activation returned false')
      return
    }
    log.info('activation returned true')
    execute()
  }

  function execute () {
    return variationFn(_.cloneDeep(options))
  }
}
