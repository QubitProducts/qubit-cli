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
  engine(opts, globalFn, triggerFn, variationFn)
  onSecondPageView(restart)
  registerHotReloads()
}

function restart (api) {
  destroy()
  engine(opts, _.noop, triggerFn, variationFn)
}

function destroy () {
  let { removeStyles, remove } = modules.variation
  if (removeStyles) removeStyles()
  if (remove) remove()
  ;({ remove } = modules.triggers)
  if (remove) remove()
}

function globalFn () {
  eval.call(window, require('global')) // eslint-disable-line
}

function triggerFn (opts, cb) {
  modules.triggers = require('triggers') || _.noop
  opts = Object.assign({}, opts, { log: opts.log('triggers') })
  const remove = _.get(modules.triggers(opts, cb), 'remove')
  modules.triggers.remove = remove && _.once(remove)
}

function variationFn (opts) {
  modules.variation = require(__VARIATIONJS__) || _.noop
  const style = require(__VARIATIONCSS__)
  style.ref()
  opts = Object.assign({}, opts, { log: opts.log('variation') })
  const remove = _.get(require(__VARIATIONJS__)(opts), 'remove')
  modules.variation.remove = remove && _.once(remove)
  modules.variation.removeStyles = _.once(() => style.unref())
}

function onSecondPageView (cb) {
  const viewRegex = /^([^.]+\.)?[a-z]{2}View$/
  waitFor(() => window.__qubit.uv, 50, () => {
    window.uv.once(viewRegex, () => window.uv.on(viewRegex, cb)).replay()
  })
}

function registerHotReloads () {
  if (!module.hot) return
  module.hot.accept(allModules(), () => {
    const variation = require(__VARIATIONJS__)
    const triggers = require('triggers')
    if (cold(variation, modules.variation, modules.variation.remove)) return window.location.reload()
    if (cold(triggers, modules.triggers, modules.triggers.remove)) return window.location.reload()
    restart()
  })

  function allModules () {
    return _.uniq(context.keys().map(key => context.resolve(key))).concat([require.resolve(__VARIATIONJS__)])
  }

  function cold (current, old, remove) {
    return (current && current !== old && !remove)
  }
}

function waitFor (test, ms, cb) {
  if (test()) return cb()
  setTimeout(() => waitFor(test, ms, cb), ms)
}
