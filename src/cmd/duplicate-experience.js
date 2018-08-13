const _ = require('lodash')
const path = require('path')
const log = require('../lib/log')
const formatLog = require('../lib/format-log')
const suggest = require('../lib/suggest')
const getPkg = require('../lib/get-pkg')
const cloneExperience = require('../lib/clone-experience')
const experienceService = require('../services/experience')
const CWD = process.cwd()

module.exports = async function duplicateExperience (destinationPropertyId, experienceId) {
  const pkg = await getPkg()
  if (!experienceId) experienceId = _.get(pkg, 'meta.experienceId')
  if (!experienceId) {
    let propertyId = await suggest.property(formatLog('What property would you like to duplicate from?'))
    if (!propertyId) return
    let experienceId = await suggest.experience(propertyId)
    if (!experienceId) return
  }
  if (!destinationPropertyId) destinationPropertyId = await suggest.property(formatLog('What property would you like to duplicate to?'))
  if (!destinationPropertyId) return
  const experience = await experienceService.get(experienceId)
  const duplicateOptions = { id: experienceId, name: `${experience.name} (copy)`, target_property_id: destinationPropertyId, preview_url: 'http://example.com' }
  const duplicatedExperience = await experienceService.duplicate(experienceId, duplicateOptions)
  const location = pkg ? path.join(CWD, '../') : CWD
  await cloneExperience(location, destinationPropertyId, duplicatedExperience.id)
  log.info(`Parent directory is ${location}`)
}
