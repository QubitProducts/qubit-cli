/* globals __WAIT__ __VARIATIONJS__ __VARIATIONCSS__ */
if (__WAIT__) {
  waitFor(qubit, run)
} else {
  run()
}

var opts = {}
function run () {
  require('global')
  var ret = require('triggers')(opts, function (pass) {
    var shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      console.log('activation returned false')
      return
    }
    console.log('activation returned true')
    execute(opts)
  })
  if (ret === true) execute(opts)
}

function execute (opts) {
  require(__VARIATIONCSS__)
  require(__VARIATIONJS__)(opts)
}

function waitFor (thing, cb, i) {
  if (i === 100) return
  if (thing()) return cb()
  setTimeout(function () {
    waitFor(thing, cb, 1 + (i || 0))
  }, 10 * i)
}

function qubit () {
  return window.__qubit && window.__qubit.amd && window.__qubit.amd.require
}
