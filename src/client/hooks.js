const _ = require('slapdash')

module.exports = function createHooks () {
  const hooks = {
    triggers: {
      remove: [],
      onActivation: []
    },
    variation: {
      remove: []
    }
  }

  return { addHooks, runHooks, hasHooks }

  function hasHooks (name, hookName) {
    return Boolean(hooks[name][hookName].length)
  }

  function addHooks (name, hookName, hook) {
    hooks[name][hookName].push(hook)
  }

  function runHooks (name, hookName, logger) {
    return Promise.all(_.map(hooks[name][hookName], runHook))

    function runHook (hook) {
      return new Promise(resolve => resolve(hook())).catch(err =>
        logger.error(err)
      )
    }
  }
}
