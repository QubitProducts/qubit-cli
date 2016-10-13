module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn) {
  globalFn()
  if (triggerFn(options, activate)) execute()

  function activate (pass) {
    var shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      console.log('activation returned false')
      return
    }
    console.log('activation returned true')
    execute()
  }

  function execute () {
    var api = variationFn(options)
    if (!module.hot) return
    if (api && api.remove) {
      module.hot.accept()
      module.hot.dispose(function () {
        api.remove()
      })
    } else {
      module.hot.decline()
    }
  }
}
