const _ = require('lodash')
const chalk = require('chalk')
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
let opn = require('opn')

module.exports = async function previewLink (page, options) {
  const pkg = await getPkg()
  if (!_.get(pkg, 'meta')) return required()
  const { propertyId, experienceId } = pkg.meta

  if (!propertyId || !experienceId) return required()

  const experienceUrl = `https://app.qubit.com/p/${propertyId}/experiences/${experienceId}`

  if (/^editor|settings|overview$/.test(page)) {
    return opn(`${experienceUrl}/${page === 'overview' ? '' : page}`)
  }

  function required () {
    return log(chalk.red(`You must be inside an experience folder in order to use this feature!`))
  }
}
