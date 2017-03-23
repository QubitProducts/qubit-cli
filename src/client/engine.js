const log = require('./log')

module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn, bypassTriggers) {
  log.info('running global')
  globalFn()

  if (bypassTriggers) return execute()
  log.info('running triggers')

  if (triggerFn(options, activate) === true) execute()

  function activate (pass) {
    const shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      log.info('triggers returned false')
      return
    }
    log.info('triggers returned true')
    execute()
  }

  function execute () {
    log.info('running variation')
    return variationFn(options)
  }
}
