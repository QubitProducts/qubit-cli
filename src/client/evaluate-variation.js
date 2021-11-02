const Promise = require('sync-p')
const _ = require('slapdash')

module.exports = function evaluateVariation (api, fn, addStyles) {
  let removeStyles
  return new Promise(function (resolve, reject) {
    try {
      removeStyles = addStyles()
      if (fn.__esModule) {
        // Detect and run ES Module default export
        resolve(fn.default(api))
      } else {
        resolve(fn(api))
      }
    } catch (error) {
      error.userCodeError = true
      reject(error)
    }
  }).then(
    function success (returnValue) {
      return {
        remove: _.get(returnValue, 'remove')
      }
    },
    function failure (error) {
      if (removeStyles) removeStyles()
      error.userCodeError = true
      throw error
    }
  )
}
