const experienceService = require('./experience')
const iterationService = require('./iteration')
const goalsService = require('./goal')
const variationService = require('./variation')
const codeService = require('./code')
const mergePkg = require('../lib/merge-pkg')
const getPkg = require('../lib/get-pkg')

module.exports = async function down (experienceId, iterationId) {
  const pkg = await getPkg()
  const experience = await experienceService.get(experienceId)
  iterationId = iterationId || experience.last_iteration_id
  const iteration = await iterationService.get(iterationId)
  const goals = await goalsService.get(iterationId)
  const variations = await variationService.getAll(iterationId)
  const files = codeService.getCode(experience, iteration, goals, variations)
  files['package.json'] = JSON.stringify(mergePkg(pkg || {}, files['package.json']), null, 2)
  return { experience, iteration, variations, files }
}
