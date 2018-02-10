const qubitThings = require('./qubit-things')
const log = require('./log')
const Promise = require('sync-p')

module.exports = function getJolt () {
  return qubitThings('jolt') || mockJolt()
}

function mockJolt () {
  let fakeJolt = {}
  ;['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess'].forEach(method => {
    fakeJolt[method] = function () {
      let replay, dispose, call
      waitUntil(() => qubitThings('jolt')).then(() => {
        let jolt = qubitThings('jolt')
        if (jolt) {
          call = jolt[method].apply(jolt, arguments)
          if (replay) call.replay()
          if (dispose) call.dispose()
        } else {
          log.warn('Jolt was not found')
        }
      })
      return {
        replay: () => {
          replay = true
          if (call) call.replay()
        },
        dispose: () => {
          dispose = true
          if (call) call.dispose()
        }
      }
    }
  })
  Object.defineProperty(fakeJolt, 'events', {
    get: function get () {
      let jolt = qubitThings('jolt')
      return jolt ? jolt.events : []
    }
  })
  return fakeJolt
}

function waitUntil (test) {
  let interval
  return new Promise(resolve => {
    if (test()) return finish()
    interval = setInterval(() => {
      if (test()) return finish()
    }, 100)

    function finish () {
      clearInterval(interval)
      resolve()
    }
  })
}
