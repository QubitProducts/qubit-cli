module.exports = function hasNoCode (code) {
  if (typeof code !== 'string') return true
  return /^\s*$/.test(code.trim())
}
