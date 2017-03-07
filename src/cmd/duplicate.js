const _ = require('lodash')
const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
const variationService = require('../services/variation')
const codeService = require('../services/code')
const readFiles = require('../lib/read-files')
const fs = require('fs-promise')
const path = require('path')
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

    const variationData = {
      advanced_mode: true,
      custom_styles: cssCode || CSS,
      execution_code: executionCode || EXECUTION,
      experimentId: Number(experienceId),
      isDirty: false,
      name: `Variation ${variationId} copy`,
      options: null
    }

    const variationResponse = await variationService.duplicate(propertyId, experienceId, variationData)
    if (variationResponse) writeVariation(variationResponse)

    function writeVariation (variation) {
      const variationJS = `variation-${variation.id}.js`
      const variationCSS = `variation-${variation.id}.css`
      if (variation.execution_code && variation.custom_styles) {
        fs.outputFile(path.join(CWD, variationJS), variation.execution_code)
        fs.outputFile(path.join(CWD, variationCSS), variation.custom_styles)
        mergePackages()
      }
    }

    function mergePackages () {
	    const remoteFiles = await codeService.get(propertyId, experienceId)
	    const remotePkg = remoteFiles['package.json']
	    const mergedPkg = JSON.stringify(mergePkg(pkg, remotePkg), null, 2)

	    fs.outputFile(path.join(CWD, 'package.json'), mergePkg)
	    log(`Duplicated variation - ${variationId}`)
    }

  } catch (err) {
    log.error(err)
  }
}
