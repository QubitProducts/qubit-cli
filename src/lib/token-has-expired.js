const ms = require('ms')
const jwt = require('jsonwebtoken')

module.exports = function tokenHasExpired (token) {
  if (!token) return true
  let buffer = ms('5 minutes') / 1000
  let decoded = jwt.decode(token)
  return decoded < Math.round((Date.now() / 1000) + buffer)
}
