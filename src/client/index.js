/* globals __VARIATION__ __VARIATION_STYLE_EXTENSION__ __FILES__ */
const engine = require('./engine')
const applyPreviewSettings = require('./preview-settings')
const evaluateTriggers = require('./evaluate-triggers')
const evaluateVariation = require('./evaluate-variation')
const createOptions = require('./options')
const onSecondPageView = require('./pageview')
const applyStyles = require('./styles')
const globalFn = once(() => eval.call(window, require('global'))) // eslint-disable-line
const STYLE_ID = 'qubit-cli-styles'
require('./amd')()

// This file is trying to achieve a lot of things, but getting all the different
// hot reloading cases right is tricky, and splitting stuff out into different files
// affects how hot reloading works
// Here are some of the things we are trying to achieve:
// - If the variation returns a remove function, we can hot reload and re-execute it when it changes
// - If the variation does not return a remove function, once executed we have to reload the page when it changes
// - If the triggers returns a remove function, we can hot reload and re-execute it when it changes
// - If the triggers do not return a remove function, once executed we have to reload the page when it changes

// Imagine the user is developing a modal, it should never be the case that two modals appear on screen
// We avoid this either by ensuring a remove or cleanup function is called before re-executing or by
// reloading the whole page

// Also if the triggers have passed and we are editing the variation
// we don't want to keep having to reload the triggers (imagine forcing the user to have to
// click on a CTA every time they change their variation code), so we keep track of whether
// the variation has activated yet or not and only rerun triggers if it hasn't

let {
  destroy,
  modules,
  variationIsSpent,
  triggersIsSpent,
  hasActivated,
  runAcrossViews
} = init()

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
  const options = createOptions(modules.pkg, __VARIATION__)

  applyPreviewSettings(options.meta, options.include, options.exclude)

  engine(options, globalFn, triggerFn, variationFn, bypassTriggers)

  function triggerFn (options) {
    return evaluateTriggers(options, modules.triggers)
      .then(({ onActivation, remove, execute }) => {
        if (onActivation && execute) onActivation()
        runAcrossViews = runAcrossViews === true
        if (remove) {
          cleanup.push(remove)
        } else {
          triggersSpent = true
        }
        return {
          execute: execute
        }
      })
  }

  function variationFn (options) {
    isActive = true
    let removeStyles
    return evaluateVariation(
      options,
      modules.variation,
      () => {
        removeStyles = applyStyles(STYLE_ID, modules.styles)
        return removeStyles
      }
    )
      .then(({ remove }) => {
        cleanup.push(removeStyles)
        if (remove) {
          cleanup.push(remove)
        } else {
          variationSpent = true
        }
      })
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
  ;({
    destroy,
    modules,
    variationIsSpent,
    triggersIsSpent,
    hasActivated,
    runAcrossViews
  } = init(bypassTriggers))
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
