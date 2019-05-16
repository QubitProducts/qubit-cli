var Promise = require('sync-p')
var _ = require('slapdash')

module.exports = function evaluateVariation (api, fn, addStyles) {
  let removeStyles
  return new Promise(function (resolve, reject) {
    try {
      removeStyles = addStyles()
      resolve(fn(api))
    } catch (error) {
      error.userCodeError = true
      reject(error)
    }
  })
    .then(function success (returnValue) {
      return {
        remove: _.get(returnValue, 'remove')
      }
    }, function failure (error) {
      if (removeStyles) removeStyles()
      error.userCodeError = true
      throw error
    })
}
