const Promise = require('sync-p/extra')
const _ = require('slapdash')

module.exports = function evaluateTriggers (api, fn) {
  if (!fn) return Promise.resolve({ execute: true })

  return new Promise(function (resolve, reject) {
    if (typeof fn !== 'function') {
      return resolve({ execute: !!fn })
    }

    const callback = Promise.defer()
    _.assign(callback.resolve, api)
    let returnValue
    try {
      if (fn.length <= 1) {
        returnValue = fn(callback.resolve)
      } else if (fn.length === 2) {
        returnValue = fn(api, callback.resolve)
      }
    } catch (error) {
      error.userCodeError = true
      return reject(error)
    }

    if (!isPromise(returnValue)) {
      switch (typeof returnValue) {
        case 'boolean':
          return resolve({ execute: returnValue })
        case 'undefined':
        case 'object':
          returnValue = returnValue || {}
          if (returnValue.remove) api.onRemove(returnValue.remove)
          delete returnValue.remove
          return resolve(
            callback.promise.then(function (callbackArgument) {
              return _.assign({}, returnValue, {
                execute: evaluateReturnValue(callbackArgument)
              })
            })
          )
        case 'default':
          return resolve(returnValue)
      }
    }

    return resolve(
      returnValue.then(function (returnValue) {
        return _.assign(
          {},
          {
            execute: evaluateReturnValue(returnValue)
          },
          returnValue
        )
      })
    )
  }).then(
    function finished (result) {
      return result
    },
    function catchAsyncUserErrror (error) {
      error.userCodeError = true
      throw error
    }
  )
}

function evaluateReturnValue (returnValue) {
  return Boolean(typeof returnValue === 'undefined' || returnValue)
}

function isPromise (value) {
  return typeof value === 'object' && Boolean(value.then)
}
