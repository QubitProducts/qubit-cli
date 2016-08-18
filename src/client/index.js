/* globals __WAIT__ __VARIATIONJS__ __VARIATIONCSS__ */
var PKG = require('package.json') || {}
var META = PKG.meta

if (__WAIT__) {
  waitFor(qubit, init)
} else {
  init()
}

function init () {
  require('global')
  var ret = require('triggers')(META, activate)
  if (ret === true) execute()
}

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
  require(__VARIATIONJS__)(META)
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
