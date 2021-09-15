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
    (
      await input.text(
        formatLog('   What would you like to call your placement?'),
        { default: 'My new placement' }
      )
    ).trim()

  const preact = await input.select(
    formatLog('   What would you like to include preact in your dependencies?'),
    [
      { value: true, name: formatLog('   Yes') },
      { value: false, name: formatLog('   No') }
    ]
  )
  const { stdout } = await exec('npm', ['show', '@qubit/utils', '--json'], {})
  const { version } = JSON.parse(stdout)

  const placementSpec = initialPlacement({
    tagId,
    name,
    personalisationType,
    replacements: {
      packageJson: {
        '{{qubitUtilsVersion}}': version,
        '{{conditionalDeps}}': await getConditionalDeps({ preact })
      },
      js: {
        '//conditionalDeps': getConditionalImports({ preact })
      }
    }
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

function getConditionalImports ({ preact }) {
  if (preact) {
    return `const React = require('preact')
    `
  }
  return ''
}

async function getConditionalDeps ({ preact }) {
  if (preact) {
    const { stdout } = await exec('npm', ['show', 'preact', '--json'], {})
    const { version } = JSON.parse(stdout)
    // we start with a " to end the last dependency's string
    return `",
      "preact": "^${version}`
    // then we don't need a closing " because there already is one in the file
  }

  return ''
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

const initialPlacement = ({
  tagId,
  name,
  personalisationType,
  replacements
}) => ({
  name,
  tags: [tagId],
  personalisationType,
  schema: {
    definition: schemaTypes[personalisationType],
    samplePayload: {}
  },
  implementationType: 'CODE_INJECTION',
  code: {
    js: updateDependencies(PLACEMENT_JS, replacements.js),
    packageJson: updateDependencies(
      PLACEMENT_PKG_JSON,
      replacements.packageJson
    )
  }
})

function updateDependencies (pkgJson, replacements) {
  let updated = pkgJson
  Object.entries(replacements).forEach(([key, value]) => {
    updated = updated.replace(key, value)
  })
  return updated
}
