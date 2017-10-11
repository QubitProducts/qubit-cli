const log = require('./log')

module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn, bypassTriggers) {
  log.info('Running global')
  globalFn()

  if (bypassTriggers) return execute()
  log.info('Running triggers')

  if (triggerFn(options, activate) === true) execute()

  function activate (pass) {
    const shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      log.info('Triggers returned false')
      return
    }
    log.info('Triggers returned true')
    execute()
  }

  function execute () {
    log.info('Running variation')
    return variationFn(options)
  }
}
