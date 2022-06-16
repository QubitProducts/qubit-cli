const config = require('config')
const _ = require('lodash')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
const opn = require('opn')

module.exports = async function previewLink (page = 'editor', options) {
  const pkg = await getPkg()
  if (!_.get(pkg, 'meta')) return required()
  const { propertyId, experienceId } = pkg.meta

  if (!propertyId || !experienceId) return required()

  const experienceUrl = `${
    config.services.app
  }/p/${propertyId}/experiences/${experienceId}`

  if (/^editor|settings|overview$/.test(page)) {
    return opn(`${experienceUrl}/${page === 'overview' ? '' : page}`, {
      wait: false
    })
  }

  function required () {
    return log.warn(
      'You must be inside an experience folder in order to use this feature!'
    )
  }
}
