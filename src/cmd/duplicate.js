const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const variationService = require('../services/variation')
const readFiles = require('../lib/read-files')
let CWD = process.cwd()

module.exports = async function duplicate (variation) {
  try {
  	const { EXECUTION, CSS } = variationService.DEFAULTS
    const pkg = await getPkg()
    const {propertyId, experienceId} = pkg.meta
    const variationMatch = variation.match(/\d+/g)
    const variationId = variationMatch && variationMatch[0]

    const localFiles = await readFiles(CWD)
    const executionCode = localFiles[`variation-${variationId}.js`]
    const cssCode = localFiles[`variation-${variationId}.css`]

    const data = {
    	advanced_mode: true,
      custom_styles: cssCode || CSS,
      execution_code: executionCode || EXECUTION,
      experimentId: Number(experienceId),
      isDirty: false,
      name: `Variation ${variationId} copy`,
      options: null
    }
    console.log(data)
    const variationResponse = await variationService.duplicate(propertyId, experienceId, data)
    console.log(variationResponse)

    // if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  } catch (err) {
    log.error(err)
  }
}
