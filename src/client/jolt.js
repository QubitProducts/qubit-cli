const qubitThings = require('./qubit-things')
const log = require('./log')
const Promise = require('sync-p')

module.exports = function getJolt () {
  return qubitThings('jolt') || mockJolt()
}

function mockJolt () {
  var fakeJolt = {}
  ;['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess'].forEach(method => {
    fakeJolt[method] = function () {
      waitUntil(() => qubitThings('jolt')).then(() => {
        let jolt = qubitThings('jolt')
        if (jolt) {
          jolt[method].apply(jolt, arguments)
        } else {
          log.warn('Jolt was not found')
        }
      })
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
