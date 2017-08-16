const _ = require('lodash')

module.exports = { isName, isUrl, isId, isPath, isSubmodule }

function isName (str) {
  return _.isString(str) && /^[\w-/.]+$/.test(str)
}

function isUrl (str) {
  return _.isString(str) && /^http/.test(str)
}

function isId (str) {
  return /^\d+/.test(String(str))
}

function isPath (str) {
  return _.isString(str) && /^[./]/.test(str)
}

function isSubmodule (str) {
  return _.isString(str) && /[/]/.test(str.replace(/^@[^/]+\//, '')) && !isPath(str)
}
