/* globals __WAIT__ */
// this is boilerplate entry logic to glue everything together
// still required for now
if (__WAIT__) {
  waitFor(qubit, run)
} else {
  run()
}

function run () {
  require('script!global')
  var ret = require('../qubit-loader!activation')({}, function (pass) {
    var shouldActivate = pass || typeof pass === 'undefined'
    if (!shouldActivate) {
      console.log('activation returned false')
      return
    }
    console.log('activation returned true')
    execute()
  })
  if (ret === true) execute()
}

function execute () {
  require('variation.css')
  require('../../qubit-loader!execution')({})
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
