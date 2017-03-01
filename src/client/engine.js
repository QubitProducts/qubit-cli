const _ = require('lodash')
module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn) {
  globalFn()
  if (triggerFn(_.cloneDeep(options), activate) === true) execute()

  function activate (pass) {
    const shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      console.log('activation returned false')
      return
    }
    console.log('activation returned true')
    execute()
  }

  function execute () {
    return variationFn(_.cloneDeep(options))
  }
}
