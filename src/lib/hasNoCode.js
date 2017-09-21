module.exports = function hasNoCode (code) {
  return /^\s*$/.test(code)
}
