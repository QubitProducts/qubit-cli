const log = require('../lib/log')
const placementService = require('../services/placement')
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async function placementStatus (propertyId, placementId) {
  let status

  do {
    await delay(4000)
    status = await placementService.status(propertyId, placementId)
    log.info(`Placement is ${status.toLowerCase()}`)
  } while (status.endsWith('ING'))
}
