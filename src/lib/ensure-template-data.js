const path = require('path')
const _ = require('lodash')
const getPkg = require('./get-pkg')
const fs = require('fs-extra')
const exists = require('./exists')

module.exports = async function ensureTemplateData (dest) {
  const pkg = await getPkg(dest)
  const variations = _.get(pkg, 'meta.variations')
  await Promise.all(
    Object.keys(variations).map(async name => {
      const filePath = path.join(dest, `${name}.json`)
      if (!await exists(filePath)) {
        const templateData = _.get(pkg, 'meta.templateData') || {}
        return fs.outputFile(filePath, JSON.stringify(templateData, null, 2))
      }
    })
  )
}
