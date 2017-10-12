const experienceService = require('./experience')
const iterationService = require('./iteration')
const variationService = require('./variation')
const codeService = require('./code')
const mergePkg = require('../lib/merge-pkg')
const getPkg = require('../lib/get-pkg')

module.exports = async function down (experienceId) {
  const pkg = await getPkg()
  const experience = await experienceService.get(experienceId)
  const iteration = await iterationService.get(experience.last_iteration_id)
  const variations = await variationService.getAll(experience.last_iteration_id)
  const files = codeService.getCode(experience, iteration, variations)
  files['package.json'] = JSON.stringify(mergePkg(pkg || {}, files['package.json']), null, 2)
  return { experience, iteration, variations, files }
}
