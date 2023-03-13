const input = require('input')
const placementService = require('../../services/placement')
const {
  getPropertyId,
  getTagId,
  getPersonalisationType
} = require('../../lib/get-resource-ids')
const exec = require('execa')
const formatLog = require('../../lib/format-log')
const throwIf = require('../../lib/throw-if')
const clone = require('./clone')
const log = require('../../lib/log')
const { PLACEMENT_JS, PLACEMENT_PKG_JSON } = require('../../constants')

module.exports = async function create (
  propertyId,
  tagId,
  personalisationType,
  name
) {
  await throwIf.none('create')
  propertyId = await getPropertyId(propertyId, {})
  tagId = await getTagId(propertyId, tagId, {})
  personalisationType = await getPersonalisationType(personalisationType, {})

  name =
    name ||
    (await input.text(
      formatLog('   What would you like to call your placement?'),
      { default: 'My new placement' }
    )).trim()

  const placementSpec = initialPlacement({
    tagId,
    name,
    personalisationType
  })

  const placementId = await placementService.create(propertyId, placementSpec)
  const destination = await clone(propertyId, placementId)

  log.info('Installing dependencies...')

  await exec('npm', ['install'], {
    cwd: destination,
    stdio: 'inherit'
  })

  log.info('Done ✨')
}

const schemaTypes = {
  PERSONALISED_CONTENT: {
    type: 'object',
    required: [],
    reserved: [],
    properties: {}
  },
  RECOMMENDATIONS: {
    type: 'object',
    required: ['headline'],
    reserved: ['headline', 'recs'],
    properties: {
      headline: {
        type: ['string'],
        typeForUi: 'string',
        label: 'Heading',
        requiredForUi: true,
        order: 0
      }
    }
  },
  EVIDENCE_SELECTION: {
    type: 'object',
    required: [],
    reserved: ['message', 'imageUrl'],
    properties: {
      message: {
        type: ['string', 'null'],
        typeForUi: 'string',
        label: 'Message',
        order: 0
      },
      imageUrl: {
        type: ['string', 'null'],
        typeForUi: 'image',
        format: 'custom-uri',
        label: 'Image',
        order: 1
      }
    }
  }
}

const initialPlacement = ({ tagId, name, personalisationType }) => ({
  name,
  tags: [tagId],
  personalisationType,
  schema: {
    definition: schemaTypes[personalisationType],
    samplePayload: {}
  },
  implementationType: 'CODE_INJECTION',
  code: {
    js: PLACEMENT_JS,
    packageJson: JSON.parse(PLACEMENT_PKG_JSON)
  },
  catalogConfig: 'PRODUCTS'
})
