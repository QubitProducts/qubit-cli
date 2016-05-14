// this is boilerplate entry logic to glue everything together
// still required for now

waitFor(qubit, run)

function run () {
  require('script!./global')
  require('../qubit-loader!./activation')({}, function (shouldActivate) {
    if (!shouldActivate) {
      console.log('activation returned false')
      return
    }
    require('./variation.css')
    require('../qubit-loader!./execution')({})
  })
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
