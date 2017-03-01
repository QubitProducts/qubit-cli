const _ = require('lodash')
const {getFilename} = require('./variation')

function getCode (experience, variations) {
  const files = {}
  const experienceMeta = experience.meta ? JSON.parse(experience.meta) : {}
  files['package.json'] = JSON.stringify({
    name: `qubit-experience-${experience.id}`,
    description: 'An experience powered by qubit',
    meta: {
      name: experience.name,
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: _.get(experience, 'recent_iterations.draft.id'),
      previewUrl: _.get(experience, 'recent_iterations.draft.url'),
      remoteUpdatedAt: _.get(experience, 'recent_iterations.draft.updated_at'),
      variations: variations.reduce((memo, variation) => {
        memo[getFilename(variation)] = {
          variationId: variation.id,
          variationIsControl: variation.is_control,
          variationMasterId: variation.master_id,
          remoteUpdatedAt: variation.updated_at
        }
        return memo
      }, {}),
      visitor: {},
      templates: _.get(experienceMeta, 'xp.templates') || []
    }
  }, null, 2)
  return files
}

function setCode (experience, files) {
  experience = _.cloneDeep(experience)
  const pkg = JSON.parse(files['package.json'])
  experience.name = _.get(pkg, 'meta.name')
  _.set(experience, 'recent_iterations.draft.url', _.get(pkg, 'meta.previewUrl'))
  return experience
}

module.exports = { getCode, setCode }
