const rewrite = require('./lib/rewrite')

module.exports = function loader (content) {
  return rewrite(content, this.resource)
}
