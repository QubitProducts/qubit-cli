const experienceService = require('./experience')
const variationService = require('./variation')
const codeService = require('./code')

module.exports = async function down (propertyId, experienceId) {
  // const localPkg = await getPkg()
  // files['package.json'] = JSON.stringify(mergePkg(localPkg, files['package.json']), null, 2)
  const result = {
    experience: await experienceService.get(propertyId, experienceId),
    variations: await variationService.getAll(experienceId)
  }
  result.files = codeService.getCode(result.experience, result.variations)
  return result
}
