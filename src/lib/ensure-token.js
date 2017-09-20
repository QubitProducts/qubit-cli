const getToken = require('./get-token')
const auth = require('./auth')

module.exports = async function ensureToken (idToken, targetClientId, options = {}) {
  let token = await getToken(idToken, targetClientId, options)
  await auth.set('BEARER_TOKEN', token)
  return token
}
