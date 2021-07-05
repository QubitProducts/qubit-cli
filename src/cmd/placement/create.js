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
    (
      await input.text(
        formatLog('   What would you like to call your placement?'),
        { default: 'My new placement' }
      )
    ).trim()

  const placementSpec = initialPlacement(
    propertyId,
    tagId,
    name,
    personalisationType
  )

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
    label: '',
    type: 'object',
    order: 0,
    required: [],
    properties: {}
  },
  RECOMMENDATIONS: {
    label: '',
    type: 'object',
    order: 0,
    required: ['recommendations'],
    properties: {
      headline: {
        key: 'headline',
        type: 'string',
        order: 0,
        label: 'Heading'
      },
      recommendations: {
        key: 'recommendations',
        required: true,
        type: 'array',
        minItems: 0,
        maxItems: 10
      }
    }
  },
  EVIDENCE_SELECTION: {
    label: '',
    type: 'object',
    order: 0,
    required: [],
    properties: {
      message: {
        key: 'message',
        type: 'string',
        order: 0,
        label: 'Message'
      },
      imageUrl: {
        key: 'imageUrl',
        type: 'image',
        order: 1,
        label: 'Image'
      }
    }
  }
}

const initialPlacement = (propertyId, tagId, name, personalisationType) => ({
  name,
  tags: [tagId],
  personalisationType,
  schema: {
    definition: schemaTypes[personalisationType],
    samplePayload: {}
  },
  implementationType: 'CODE_INJECTION',
  code: {
    js: `module.exports = function renderPlacement ({ content, onImpression, onClickthrough }) {
      if (content) {

      } else {
        // The content may be null under certain circumstances but in these cases the onImpression and
        //   onClickthrough should still be implemented
      }
    }

`,
    packageJson: `{\n
      "dependencies": {},\n
      "devDependencies": {
        "@qubit/jest": "^1.4.0",
        "healthier": "^4.0.0",
        "jest": "^26.6.3",
        "prettier-standard": "^16.4.1"
      },
      "healthier": {
        "globals": [
          "jest",
          "expect",
          "test",
          "describe",
          "beforeEach",
          "beforeAll",
          "afterEach",
          "afterAll",
          "Element"
        ]
      },
      "jest": {
        "transform": {
          ".*(.js|.css|.less)$": "@qubit/jest"
        }
      },
      "scripts": {
        "format": "prettier-standard --fix",
        "lint": "healthier",
        "test": "jest --coverage"
      }
    }
    `
  }
})
