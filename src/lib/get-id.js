const qubitrc = require('./qubitrc')
const jsonwebtoken = require('jsonwebtoken')
const { ID_TOKEN } = require('../constants')

module.exports = async function getId () {
  let token = await qubitrc.get(ID_TOKEN)
  if (!token) return
  try {
    return jsonwebtoken.decode(token).user_id.replace('auth0|', '').split('-')[1]
  } catch (err) {
    return `could not parse ${jsonwebtoken.decode(token).user_id}`
  }
}
