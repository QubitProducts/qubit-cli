/* globals __WAIT__ */
if (__WAIT__) {
  waitFor(qubit, run)
} else {
  run()
}

var opts = {}
function run () {
  require('global')
  var ret = require('activation')(opts, function (pass) {
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
  require('variation.css')
  require('execution')(opts)
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
