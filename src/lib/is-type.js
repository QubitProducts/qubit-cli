module.exports = { isName, isUrl, isId }

function isName (str) {
  return /^[\w-]+$/.test(String(str))
}

function isUrl (str) {
  return /^http/.test(String(str))
}

function isId (str) {
  return /^\d+/.test(String(str))
}
