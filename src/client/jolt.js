const qubitThings = require('./qubit-things')
const Promise = require('sync-p')

module.exports = function getJolt () {
  return qubitThings('jolt') || mockJolt()
}

// Mock jolt exposes jolt's api and stores calls to it until jolt is available
// it then proxies the calls made to it to actual jolt
function mockJolt (logger) {
  let fakeJolt = {}
  ;[
    'onEnrichment',
    'onceEnrichment',
    'onSuccess',
    'onceSuccess'
  ].forEach(method => {
    fakeJolt[method] = function () {
      let replay, dispose, call
      waitUntil(() => qubitThings('jolt')).then(() => {
        let jolt = qubitThings('jolt')
        if (jolt) {
          call = jolt[method].apply(jolt, arguments)
          if (replay) call.replay()
          if (dispose) call.dispose()
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

  ;['getBrowserState', 'getVisitorState'].forEach(method => {
    fakeJolt[method] = function (...args) {
      return waitUntil(() => qubitThings('jolt')).then(() => {
        let jolt = qubitThings('jolt')
        return jolt[method](...args)
      })
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
