const path = require('path')
const rewrite = require('./lib/rewrite')

module.exports = function loader (content, { file }) {
  let hasDeps = false
  try {
    let pkg = require(path.join(process.cwd(), 'package.json'))
    hasDeps = pkg.dependencies
  } catch (e) {}
  return rewrite(content, file, hasDeps)
}
