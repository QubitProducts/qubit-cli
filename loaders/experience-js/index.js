const rewrite = require('./lib/rewrite')

module.exports = function loader (content, { file }) {
  return rewrite(content, file)
}
