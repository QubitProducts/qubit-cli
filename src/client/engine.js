const logger = require('./logger')

module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn, bypassTriggers) {
  logger.info('Running global')
  globalFn()

  if (bypassTriggers) return execute()

  if (triggerFn(options, activate) === true) execute()

  function activate (pass) {
    const shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      logger.info('Triggers returned false')
      return
    }
    execute()
  }

  function execute () {
    return variationFn(options)
  }
}
