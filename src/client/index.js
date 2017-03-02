/* globals __VARIATIONJS__ __VARIATIONCSS__ __CWD__ */
const context = require.context(__CWD__)
const _ = require('lodash')
const amd = require('./amd')
const engine = require('./engine')
const options = require('./options')
const key = __VARIATIONCSS__.replace(/\.css$/, '')
const opts = options(require('package.json'), key)
const modules = { variation: {}, triggers: {} }

_.set(window, '__qubit.amd', amd())

init()

function init () {
  _.set(window, '__qubit.xp', {})
  engine(opts, globalFn, triggerFn, variationFn)
  restartOnPageView()
  handleHotReload()
}

function globalFn () {
  require('global')
}

function triggerFn (opts, cb) {
  modules.triggers = require('triggers') || _.noop
  let remove = _.get(modules.triggers(opts, cb), 'remove')
  modules.triggers.remove = remove && _.once(remove)
}

function variationFn (opts) {
  modules.variation = require(__VARIATIONJS__) || _.noop
  let style = require(__VARIATIONCSS__)
  style.ref()
  let remove = _.get(require(__VARIATIONJS__)(opts), 'remove')
  modules.variation.remove = remove && _.once(remove)
  modules.variation.removeStyles = _.once(() => style.unref())
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
  if (modules.variation.removeStyles) modules.variation.removeStyles()
  if (modules.variation.remove) modules.variation.remove()
  if (modules.triggers.remove) modules.triggers.remove()
}

function handleHotReload () {
  if (!module.hot) return
  let contextModules = _.uniq(context.keys().map(key => context.resolve(key))).concat([require.resolve(__VARIATIONJS__)])
  module.hot.accept(contextModules, () => {
    let variation = require(__VARIATIONJS__)
    if (variation && variation !== modules.variation && !modules.variation.remove) return window.location.reload()
    let triggers = require('triggers')
    if (triggers && triggers !== modules.triggers && !modules.triggers.remove) return window.location.reload()
    restart()
  })
}

function waitFor (test, ms, cb) {
  if (test()) return cb()
  setTimeout(() => waitFor(test, ms, cb), ms)
}
