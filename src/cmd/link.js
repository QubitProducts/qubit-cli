const _ = require('lodash')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
const getPreviewLinks = require('../lib/preview-links')

module.exports = async function links (page, options) {
  const pkg = await getPkg()
  if (!_.get(pkg, 'meta')) return required()
  const { propertyId, experienceId } = pkg.meta

  if (!propertyId || !experienceId) return required()

  const experienceUrl = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`

  if (/^editor|settings$/.test(page)) {
    return link(`${experienceUrl}/${page}`)
  }

  if (page === 'preview') {
    if (!_.get(pkg, 'meta.variations') || !_.get(pkg, 'meta.previewUrl')) {
      return required()
    }
    const links = await getPreviewLinks(pkg.meta)
    return link(links.join('\n'))
  }

  return link(experienceUrl)
}

function link (url) {
  log.info(url)
}

function required () {
  return log.warn(
    'You must be inside an experience folder in order to use this feature!'
  )
}
