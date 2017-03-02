/* globals __VARIATIONJS__, __VARIATIONCSS__ */
const _ = require('lodash')
const amd = require('./amd')
const engine = require('./engine')
const options = require('./options')
const key = __VARIATIONCSS__.replace(/\.css$/, '')
const opts = options(require('package.json'), key)
const cleanup = []

_.set(window, '__qubit.amd', amd())

init()

function init () {
  _.set(window, '__qubit.xp', {})
  engine(opts, globalFn, triggerFn, variationFn)
  restartOnPageView()
}

function globalFn () {
  require('global')
}

function triggerFn (opts, cb) {
  const api = require('triggers')(opts, cb)
  if (_.get(api, 'remove')) cleanup.push(api.remove)
  handleHotReload(api)
  return api
}

function variationFn (opts) {
  require(__VARIATIONCSS__)
  const api = require(__VARIATIONJS__)(opts)
  if (_.get(api, 'remove')) cleanup.push(api.remove)
  handleHotReload(api)
}

function restartOnPageView () {
  const viewRegex = /^([^.]+\.)?[a-z]{2}View$/
  waitFor(() => window.__qubit.uv, 50, function () {
    window.uv.once(viewRegex, () => window.uv.on(viewRegex, restart)).replay()
  })
}

function restart (api) {
  destroy()
  engine(opts, _.noop, triggerFn, variationFn)
}

function destroy () {
  while (cleanup.length) cleanup.pop()()
}

function handleHotReload (api) {
  if (api && api.remove) {
    const hot = module.hot
    hot.accept()
    hot.dispose(destroy)
  } else {
    module.hot.decline()
  }
}

function waitFor (test, ms, cb) {
  if (test()) return cb()
  setTimeout(() => waitFor(test, ms, cb), ms)
}
