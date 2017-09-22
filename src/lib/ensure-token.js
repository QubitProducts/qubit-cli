const getToken = require('./get-token')
const qubtrc = require('./qubitrc')

module.exports = async function ensureToken (idToken, targetClientId, options = {}) {
  let token = await getToken(idToken, targetClientId, options)
  await qubtrc.set('BEARER_TOKEN', token)
  return token
}
