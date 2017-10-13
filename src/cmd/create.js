const input = require('input')
const createExperience = require('../lib/create-experience')
const validControlSizes = require('../lib/valid-control-sizes')
const formatLog = require('../lib/format-log')
const log = require('../lib/log')
const CWD = process.cwd()

const {getPropertyId} = require('../lib/getPropertyAndExperienceIds')

module.exports = async function create (pid) {
  try {
    const propertyId = await getPropertyId(pid)
    if (!propertyId) {
      log.info(`Aborted`)
      return
    }
    const name = clean(await input.text(
      formatLog('What would you like to call your experience?').substr(2),
      { default: 'Created by Qubit-CLI' }
    ))
    const controlDecimal = await input.select(formatLog('Select control size:').substr(2), validControlSizes, { default: 0.5 })
    await createExperience(CWD, propertyId, name, controlDecimal)
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
