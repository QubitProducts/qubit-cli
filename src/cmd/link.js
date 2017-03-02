const _ = require('lodash')
const ncp = require('copy-paste')
const chalk = require('chalk')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
const getPreviewLinks = require('../lib/preview-links')

module.exports = async function previewLink (options) {
  const pkg = await getPkg()
  const { propertyId, experienceId } = pkg.meta

  if (!_.get(pkg, 'meta.variations') || !_.get(pkg, 'meta.previewUrl') || !_.get(pkg, 'meta.propertyId')) {
    log(`sorry! this feature assumes you have already setup an experience locally`)
    return log(`it uses the package.json metadata to construct the preview link for an existing experience`)
  }

  if (options.preview) {
    const links = await getPreviewLinks(pkg.meta)
    ncp.copy(links.join('\n'), () => log(chalk.green('Link(s) copied to clipboard')))
    links.map(link => log(link))
  }

  if (options.app) {
    const appURL = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`
    ncp.copy(appURL, () => log(chalk.green('Link copied to clipboard')))
    log(appURL)
  }

  if (!options.preview && !options.app) {
    log(chalk.yellow('Specify an option to get links'))
  }
}
