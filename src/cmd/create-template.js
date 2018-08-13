const input = require('../lib/input')
const formatLog = require('../lib/format-log')
const log = require('../lib/log')
const CWD = process.cwd()

const { getPropertyId } = require('../lib/get-property-and-experience-ids')
const createTemplate = require('../lib/create-template')

module.exports = async function create (pid) {
  try {
    const propertyId = await getPropertyId(pid)
    if (!propertyId) {
      log.info(`PropertyId not found, are you in an template folder?`)
      return
    }

    const name = clean(await input.text(
      formatLog('   What would you like to call your template?'), {
        validate (name) {
          if (name.length > 2) return true
          return `Template names must be greater than 2 charachters long`
        }
      }
    ))

    const description = clean(await input.text(
      formatLog('   Write a description for your template?'),
      { default: 'This template was created with qubit-cli' }
    ))

    await createTemplate(CWD, propertyId, name, description)
  } catch (err) {
    log.error(err)
  }
}

function clean (str) {
  return str.trim()
}
