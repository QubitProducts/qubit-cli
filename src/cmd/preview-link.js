const _ = require('lodash')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
const getPreviewLinks = require('../lib/preview-links')

module.exports = async function previewLink () {
  const pkg = await getPkg()
  if (!_.get(pkg, 'meta.variations') || !_.get(pkg, 'meta.previewUrl') || !_.get(pkg, 'meta.propertyId')) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to construct the preview link for an existing experience`)
  }
  const links = await getPreviewLinks(pkg.meta)
  links.map(link => log(link))
}
