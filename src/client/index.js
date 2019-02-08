/* globals __VARIATION__ __VARIATION_STYLE_EXTENSION__ __FILES__ */
const Promise = require('sync-p/extra')
const poller = require('@qubit/poller')
const engine = require('./engine')
const previewSettings = require('./preview-settings')
const options = require('./options')
const onSecondPageView = require('./pageview')
const redirectTo = require('./redirect-to')
const applyStyles = require('./styles')
const globalFn = once(() => eval.call(window, require('global'))) // eslint-disable-line
const STYLE_ID = 'qubit-cli-styles'

require('./amd')()
let {destroy, modules, variationIsSpent, triggersIsSpent, hasActivated, runAcrossViews} = init()

onSecondPageView(restart, () => runAcrossViews)
registerHotReloads(restart)

function loadModules () {
  return {
    pkg: require('package.json'),
    variation: require(__VARIATION__),
    styles: require(__VARIATION__ + __VARIATION_STYLE_EXTENSION__),
    global: require('global'),
    triggers: require('triggers')
  }
}

function init (bypassTriggers) {
  let variationSpent, triggersSpent, isActive, runAcrossViews
  let modules = loadModules()
  const cleanup = []
  const opts = options(modules.pkg, __VARIATION__)

  previewSettings(opts.api.meta, opts.include, opts.exclude)
  engine(opts.api, globalFn, triggerFn, variationFn, bypassTriggers)

  function triggerFn (opts, cb) {
    let options = withLog(opts, 'triggers')
    options.log.info('Running triggers')
    let deferred = Promise.defer()
    let api
    try {
      api = modules.triggers(options, deferred.resolve)
    } catch (err) {
      options.log.error(err)
    }
    deferred.promise.then(() => {
      if (api && api.onActivation) api.onActivation()
      runAcrossViews = api && api.runAcrossViews === true
      cb()
    })
    if (api && api.remove) {
      cleanup.push(api.remove)
    } else {
      triggersSpent = true
    }
  }

  function variationFn (opts) {
    let api, removeStyles
    isActive = true
    let options = withLog(opts, 'variation')
    options.log.info('Running variation')
    options.redirectTo = redirectTo
    modules = loadModules()
    try {
      removeStyles = applyStyles(STYLE_ID, modules.styles)
      cleanup.push(removeStyles)
      api = modules.variation(options)
    } catch (err) {
      removeStyles()
      options.log.error(err)
    }
    if (api && api.remove) {
      cleanup.push(api.remove)
    } else {
      variationSpent = true
    }
  }

  function withLog (opts, logName) {
    const logger = opts.log(logName)
    return {
      ...opts,
      log: logger,
      poll: function poll (targets, options) {
        return poller(targets, {
          logger: logger,
          stopOnError: true,
          ...options
        })
      }
    }
  }

  function destroy () {
    while (cleanup.length) cleanup.pop()()
  }

  return {
    destroy,
    modules,
    variationIsSpent: () => variationSpent,
    triggersIsSpent: () => triggersSpent,
    hasActivated: () => isActive,
    runAcrossViews
  }
}

function restart (bypassTriggers) {
  let originalRunAcrossViews = runAcrossViews
  destroy()
  ;({destroy, modules, variationIsSpent, triggersIsSpent, hasActivated, runAcrossViews} = init(bypassTriggers))
  // if bypassTriggers is true runAcrossViews will be set to undefined in the above line
  // we need to retain its original value to keep the correct behaviour
  if (bypassTriggers) runAcrossViews = originalRunAcrossViews
}

function registerHotReloads (restart) {
  if (!module.hot) return
  module.hot.accept(__FILES__, () => {
    const newModules = loadModules()
    const edited = Object.keys(newModules).find(m => newModules[m] !== modules[m])
    modules = newModules

    const styleEl = document.getElementById(STYLE_ID)
    if (styleEl && styleEl.innerHTML !== newModules.styles) return applyStyles(STYLE_ID, newModules.styles)
    if (variationIsSpent()) return window.location.reload() // variation is a cold executed variation
    if (triggersIsSpent() && edited === 'triggers') return window.location.reload()
    if (edited === 'triggers') restart()
    // if not editing triggers, bypass activation
    if (hasActivated()) restart(true)
    // if hasn't activated yet no need to restart, as variation is loaded dynamically
  })
}

function once (fn) {
  let called = false
  return function callOnce () {
    if (called) return
    called = true
    fn()
  }
}
