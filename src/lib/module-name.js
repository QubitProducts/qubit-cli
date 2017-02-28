const {isPath} = require('./is-type')

module.exports = function moduleName (str) {
  return isPath(str)
    ? str
    : str.match(/^(?:@[^/]+\/)?[^/]+/)[0]
}
