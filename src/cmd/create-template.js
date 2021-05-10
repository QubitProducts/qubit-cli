const input = require('../lib/input')
const formatLog = require('../lib/format-log')
const CWD = process.cwd()

const { getPropertyId } = require('../lib/get-resource-ids')
const getTemplate = require('../lib/create-template')

module.exports = async function createTemplate (propertyId) {
  propertyId = await getPropertyId(propertyId)

  const name = clean(
    await input.text(
      formatLog('   What would you like to call your template?'),
      {
        validate (name) {
          if (name.length > 2) return true
          return 'Template names must be greater than 2 charachters long'
        }
      }
    )
  )

  const description = clean(
    await input.text(formatLog('   Write a description for your template?'), {
      default: 'This template was created with qubit-cli'
    })
  )

  return getTemplate(CWD, propertyId, name, description)
}

function clean (str) {
  return str.trim()
}
