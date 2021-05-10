const qubitrc = require('./qubitrc')
const jsonwebtoken = require('jsonwebtoken')
const { ID_TOKEN } = require('../constants')

module.exports = async function getId () {
  const token = await qubitrc.get(ID_TOKEN)
  if (!token) return
  try {
    const decoded = jsonwebtoken.decode(token) || {}
    return {
      username: decoded.user_id && decoded.user_id.replace('auth0|', ''),
      email: decoded.email
    }
  } catch (err) {
    return {}
  }
}
