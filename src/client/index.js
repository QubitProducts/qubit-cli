/* globals __VARIATION__ __CWD__ */
const context = require.context(__CWD__)
const _ = require('lodash')
const engine = require('./engine')
const also = require('./also')
const options = require('./options')
const onSecondPageView = require('./pageview')
const applyStyles = require('./styles')
const globalFn = _.once(() => eval.call(window, require('global'))) // eslint-disable-line
const STYLE_ID = 'qubit-xp-styles'
require('./amd')()
let { modules, destroy, varationIsSpent, triggersIsSpent } = init()

onSecondPageView(restart)
registerHotReloads(restart)

function loadModules () {
  return {
    pkg: require('package.json'),
    variation: require(__VARIATION__),
    styles: require(__VARIATION__ + '.css'),
    global: require('global'),
    triggers: require('triggers')
  }
}

function init (bypassTriggers) {
  let variationSpent, triggersSpent
  let modules = loadModules()
  const cleanup = []
  const opts = options(modules.pkg, __VARIATION__)

  also(opts.also, opts.api.meta.cookieDomain)
  engine(opts.api, globalFn, triggerFn, variationFn, bypassTriggers)

  function triggerFn (opts, cb) {
    let api = modules.triggers(withLog(opts, 'triggers'), cb)
    if (api.remove) {
      cleanup.push(api.remove)
    } else {
      triggersSpent = true
    }
  }

  function variationFn (opts) {
    let api = modules.variation(withLog(opts, 'variation'))
    cleanup.push(applyStyles(STYLE_ID, modules.styles))
    if (api.remove) {
      cleanup.push(api.remove)
    } else {
      variationSpent = true
    }
  }

  function withLog (opts, logName) {
    return Object.assign({}, opts, { log: opts.log(logName) })
  }

  function destroy () {
    while (cleanup.length) cleanup.pop()()
  }

  return {
    modules,
    destroy,
    varationIsSpent: () => variationSpent,
    triggersIsSpent: () => triggersSpent
  }
}

function restart (bypassTriggers) {
  destroy()
  ;({ modules, destroy, varationIsSpent, triggersIsSpent } = init(bypassTriggers))
}

function registerHotReloads (restart) {
  if (!module.hot) return
  module.hot.accept(allModules(), () => {
    let newModules = loadModules()
    let edited = Object.keys(newModules).find(m => newModules[m] !== modules[m])

    let styleEl = document.getElementById(STYLE_ID)
    if (styleEl && styleEl.innerHTML !== newModules.styles) return applyStyles(STYLE_ID, newModules.styles)
    if (varationIsSpent()) return window.location.reload() // variation is a cold executed variation
    if (triggersIsSpent() && edited === 'triggers') return window.location.reload()
    // ignore triggers if they aren't being edited
    let bypassTriggers = edited !== 'triggers'
    restart(bypassTriggers)
  })

  function allModules () {
    return _.uniq(context.keys().map(key => context.resolve(key))).concat([require.resolve(__VARIATION__ + '.js')])
  }
}
