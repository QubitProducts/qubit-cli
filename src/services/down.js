const propertyServicve = require('./property')
const experienceService = require('./experience')
const iterationService = require('./iteration')
const variationService = require('./variation')
const goalsService = require('./goal')
const qfnService = require('./qfn')
const codeService = require('./code')
const mergePkg = require('../lib/merge-pkg')
const getPkg = require('../lib/get-pkg')

module.exports = async function down (experienceId, iterationId) {
  const pkg = await getPkg()
  const experience = await experienceService.get(experienceId)
  const property = await propertyServicve.get(experience.property_id)
  iterationId = iterationId || experience.last_iteration_id
  const iteration = await iterationService.get(iterationId)
  const goals = await goalsService.get(iterationId)
  const qfns = await qfnService.get(iterationId)
  const variations = await variationService.getAll(iterationId)
  const files = codeService.getCode(property, experience, iteration, goals, qfns, variations)
  files['package.json'] = JSON.stringify(mergePkg(pkg || {}, files['package.json']), null, 2)
  return { experience, iteration, variations, files }
}
