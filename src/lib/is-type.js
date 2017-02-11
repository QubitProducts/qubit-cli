module.exports = { isName, isUrl, isId, isPath, isSubmodule }

function isName (str) {
  return /^[\w-/.]+$/.test(String(str))
}

function isUrl (str) {
  return /^http/.test(String(str))
}

function isId (str) {
  return /^\d+/.test(String(str))
}

function isPath (str) {
  return /^[./]/.test(str)
}

function isSubmodule (str) {
  return /[/]/.test(str.replace(/^@[^/]+\//, '')) && !isPath(str)
}
