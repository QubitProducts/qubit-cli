/* globals __VARIATIONJS__, __VARIATIONCSS__ */
const amd = require('./amd')
const engine = require('./engine')
const options = require('./options')
const key = __VARIATIONCSS__.replace(/\.css$/, '')
const opts = options(require('package.json'), key)

window.__qubit = window.__qubit || {}
window.__qubit.amd = amd()
init()

function init () {
  engine(opts, globalFn, triggerFn, variationFn)
  window.__qubit = window.__qubit || { smartserve: {} }
  window.__qubit.smartserve = window.__qubit.smartserve || {}
  window.__qubit.xp = window.__qubit.xp || {}

  overrideStart(window.__qubit.smartserve, function () {
    return engine(opts, noop, triggerFn, variationFn)
  })
}

function overrideStart (smartserve, cb) {
  window.__qubit.xp.start = window.__qubit.xp.start || null
  Object.defineProperty(smartserve, 'start', {
    configurable: true,
    get: function () {
      return function () {
        cb()
        return window.__qubit.xp.start.apply(smartserve, arguments)
      }
    },
    set: function (newStart) {
      window.__qubit.xp.start = newStart
    }
  })
}

function globalFn () {
  require('global')
}

function triggerFn (opts, cb) {
  return require('triggers')(opts, cb)
}

function variationFn (opts) {
  require(__VARIATIONCSS__)
  const api = require(__VARIATIONJS__)(opts)
  if (api && api.remove) {
    module.hot.accept()
    module.hot.dispose(function () {
      api.remove()
    })
  } else {
    module.hot.decline()
  }
}

function noop () {}
