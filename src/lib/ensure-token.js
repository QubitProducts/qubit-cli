const getToken = require('./get-token')
const xprc = require('./xprc')

module.exports = async function ensureToken (idToken, targetClientId, options = {}) {
  let token = await getToken(idToken, targetClientId, options)
  await xprc.set('BEARER_TOKEN', token)
  return token
}
