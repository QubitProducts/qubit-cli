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

function executeAgainOnCodeChange (api) {
  var hot = module.hot
  hot.accept()
  hot.dispose(api.remove)
}

function handleHotReload (api) {
  if (api && api.remove) {
    executeAgainOnCodeChange(api)
  } else {
    module.hot.decline()
  }
}

function triggerFn (opts, cb) {
  var api = require('triggers')(opts, cb)
  handleHotReload(api)
}

function variationFn (opts) {
  require(__VARIATIONCSS__)
  var api = require(__VARIATIONJS__)(opts)
  handleHotReload(api)
}

function noop () {}
