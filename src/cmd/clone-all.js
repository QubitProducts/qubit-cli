const { property } = require('../lib/suggest')
const cloneExperience = require('../lib/clone-experience')
const { getAll } = require('../services/experience')
const pMap = require('p-map')
const log = require('../lib/log')
const CWD = process.cwd()

module.exports = async function cloneAll (propertyId) {
  if (!propertyId) propertyId = await property()
  const all = await getAll(propertyId)
  await pMap(all, ({ id }) => cloneExperience(CWD, propertyId, id, { concurrency: 1 }))
  log.info(`All done!`)
}
