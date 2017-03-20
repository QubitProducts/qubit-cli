const _ = require('lodash')
const log = require('./log')

module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn) {
  _.set(window, '__qubit.amd.define', window.__qubit.xp.amd.define)
  log.info('running global')
  globalFn()
  log.info('running activation')
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
    log.info('running variation')
    return variationFn(_.cloneDeep(options))
  }
}
