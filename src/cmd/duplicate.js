const log = require('../lib/log')
const getPkg = require('../lib/get-pkg')
const variationService = require('../services/variation')
const readFiles = require('../lib/read-files')
const chalk = require('chalk')
const fs = require('fs-promise')
const path = require('path')
let CWD = process.cwd()
const _ = require('lodash')
const connect = require('../server/lib/connect')
const template = require('./template')
const down = require('../services/down')
const mergePkg = require('../lib/merge-pkg')

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

    if (executionCode === undefined || cssCode === undefined) {
    	return log(`${chalk.red.bold(`Duplication Failed: Variation ${variationId} does not exist.`)}`)
    }

    const variationData = {
      advanced_mode: true,
      custom_styles: cssCode || CSS,
      execution_code: executionCode || EXECUTION,
      experimentId: Number(experienceId),
      isDirty: false,
      name: `Variation ${variationId} copy`,
      options: null
    }

    // const variationResponse = await variationService.duplicate(propertyId, experienceId, data)
    // if (variationResponse) writeVariation(variationResponse)

    // function writeVariation (variation) {
    //   const variationJS = `variation-${variation.id}.js`
    //   const variationCSS = `variation-${variation.id}.css`
    //   if (variation.execution_code && variation.custom_styles) {
    //     fs.outputFile(path.join(CWD, variationJS), variation.execution_code)
    //     fs.outputFile(path.join(CWD, variationCSS), variation.custom_styles)
    //   }
    // }

    const files = await down(propertyId, experienceId)
    const val = files['package.json']
    console.log(val)
    if (_.get(pkg, 'meta')) mergePkg(pkg, files['package.json'])

    // if (_.get(pkg, 'meta')) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  } catch (err) {
    log.error(err)
  }
}
