const config = require('../../config')
const axios = require('axios')
const log = require('./log')
const login = require('../server/lib/login')
const getUpdate = require('./getUpdate')
const { getAppToken } = require('./get-token')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST'),
  delete: fetchWithAuth('DELETE')
}

function fetchWithAuth (method) {
  return async function fetch (path, data, options = {}) {
    const notifier = getUpdate()
    if (notifier.update) {
      log.error(`Please ensure you are on the latest version in order to interact with qubit's APIs`)
      notifier.notify({ defer: false, isGlobal: true })
      return process.exit(1)
    }
    const url = config.services.app + path
    log.debug(`${method} ${url}`)
    let headers, appToken
    try {
      appToken = await getAppToken(() => login())
      headers = { ...options.headers || {}, 'Authorization': `Bearer ${appToken}` }
      return await axios(url, { method, data, headers }).then(handler, errorHandler)
    } catch (err) {
      if (options.isRetry) {
        log.error(`Error trying to fetch ${url}`)
        log.error(err)
        throw err
      } else {
        log.debug(`Error trying to fetch ${url}`)
        log.debug(err)
      }
      return fetch(path, data, { ...options, isRetry: true })
    }

    function checkErrors (resp) {
      if (resp.status === 422) throw new Error(`Unprocessable entity at url ${url}`)
      if (resp.status === 404) throw new Error(`Nothing found at url ${url}`)
      if (isLoggedOut(resp)) throw new Error('Credentials rejected')
    }

    function errorHandler (error) {
      const resp = error.response
      checkErrors(resp)
      throw new Error(error)
    }

    function handler (resp) {
      checkErrors(resp)
      return resp.data
    }
  }
}

function isLoggedOut (resp) {
  return resp.data === 'Unauthorized' || (typeof resp.data === 'string' && resp.data.includes('login.less'))
}
