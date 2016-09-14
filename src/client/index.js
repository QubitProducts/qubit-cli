/* globals __VARIATIONJS__ __VARIATIONCSS__ */
var PKG = require('package.json') || {}
var META = PKG.meta

require('./amd')(function init () {
  require('global')
  var ret = require('triggers')(META, activate)
  if (ret === true) execute()
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
  var api = variation(META)
  if (module.hot && api && api.remove) {
    module.hot.accept()
    module.hot.dispose(function () {
      api.remove()
    })
  } else {
    module.hot.decline()
  }
}
