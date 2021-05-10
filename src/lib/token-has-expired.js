const jwt = require('jsonwebtoken')

module.exports = function tokenHasExpired (token, now, buffer) {
  if (!token) return true
  const decoded = jwt.decode(token)
  // Refresh tokens decode to null and don't expire
  if (!decoded) return false
  // we want to consider the token expired if it expires in buffer milliseconds
  return decoded.exp - Math.ceil(buffer / 1000) <= Math.floor(now / 1000)
}
