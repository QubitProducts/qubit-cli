const config = require('../../config')
const axios = require('axios')
const log = require('./log')
const login = require('../server/lib/login')
const { getAppToken } = require('./get-token')

module.exports = {
  get: fetchWithAuth('GET'),
  put: fetchWithAuth('PUT'),
  post: fetchWithAuth('POST'),
  delete: fetchWithAuth('DELETE')
}

function fetchWithAuth (method) {
  return async function fetch (path, data, isRetry) {
    const url = config.services.app + path
    let headers, appToken
    try {
      appToken = await getAppToken(() => login())
      headers = { 'Authorization': `Bearer ${appToken}` }
      return axios(url, { method, data, headers }).then(handler, ({response}) => handler(response))
    } catch (err) {
      if (isRetry) {
        log.error(`Error trying to fetch ${url}`)
        process.exit()
      }
      return fetch(path, data, true)
    }

    function handler (resp) {
      if (resp.status === 422) {
        log.error(`Unprocessable entity at url ${url}`)
        return process.exit(1)
      } else if (resp.status === 404) {
        log.error(`Nothing found at url ${url}`)
        return process.exit(1)
      } else if (resp.data === 'Unauthorized' || (typeof resp.data === 'string' && resp.data.includes('login.css'))) {
        if (isRetry) {
          log.error('Credentials rejected after several attempts')
          process.exit()
        } else {
          return fetch(path, data, true)
        }
      }
      return resp.data
    }
  }
}
