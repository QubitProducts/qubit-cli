const getToken = require('./get-token')
const qubitrc = require('./qubitrc')
const { APP_TOKEN } = require('./constants')

module.exports = async function ensureToken (idToken, targetClientId, options = {}) {
  let token = await getToken(idToken, targetClientId, options)
  await qubitrc.set(APP_TOKEN, token)
  return token
}
