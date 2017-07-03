const input = require('input')
const createExperience = require('../lib/create-experience')
const suggest = require('../lib/suggest')
const validControlSizes = require('../lib/valid-control-sizes')
const log = require('../lib/log')
const CWD = process.cwd()

module.exports = async function create () {
  try {
    const propertyId = await suggest.property('Select a property')
    const name = clean(await input.text('What would you like to call your experience?', { default: 'Created by xp' }))
    const controlDecimal = await input.select('Select control size:', validControlSizes, { default: 0.5 })
    await createExperience(CWD, propertyId, name, controlDecimal)
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
