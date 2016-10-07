/* globals __VARIATIONJS__, __VARIATIONCSS__ */

var amd = require('./amd')
var pkg = require('./pkg')

module.exports = function experienceEngine () {
  var fileOptions = pkg()
  var variationName = __VARIATIONCSS__.replace(/\.css$/, '')
  var options = fileOptions[variationName]

  amd(function init () {
    require('global')
    var readyToExecute = require('triggers')(options, activate)
    if (readyToExecute) execute()
  })

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
    require(__VARIATIONCSS__)
    var variation = require(__VARIATIONJS__)
    var api = variation(options)
    if (module.hot && api && api.remove) {
      module.hot.accept()
      module.hot.dispose(function () {
        api.remove()
      })
    } else {
      module.hot.decline()
    }
  }
}
