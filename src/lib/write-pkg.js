const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const CWD = process.cwd()

module.exports = async function writePkg (pkg) {
  if (_.isObject(pkg)) {
    pkg = JSON.stringify(pkg, null, 2)
  }
  await fs.outputFile(path.join(CWD, 'package.json'), pkg)
}
