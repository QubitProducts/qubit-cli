const _ = require('lodash')
const {getFilename} = require('./variation')

function getCode (experience, variations) {
  const files = {}
  const experienceMeta = experience.meta ? JSON.parse(experience.meta) : {}
  const pkgJSON = _.get(experience, 'recent_iterations.draft.package_json') || '{}'
  files['package.json'] = JSON.stringify(Object.assign({
    name: `qubit-experience-${experience.id}`,
    version: '1.0.0',
    description: 'An experience powered by qubit'
  }, JSON.parse(pkgJSON), {
    meta: {
      name: experience.name,
      propertyId: experience.property_id,
      experienceId: experience.id,
      iterationId: _.get(experience, 'recent_iterations.draft.id'),
      previewUrl: _.get(experience, 'recent_iterations.draft.url'),
      remoteUpdatedAt: normalizeDate(_.get(experience, 'recent_iterations.draft.updated_at')),
      variations: variations.reduce((memo, variation) => {
        memo[getFilename(variation)] = {
          variationId: variation.id,
          variationIsControl: variation.is_control,
          variationMasterId: variation.master_id,
          remoteUpdatedAt: normalizeDate(variation.updated_at)
        }
        return memo
      }, {}),
      templateData: _.get(experience, 'recent_iterations.draft.template_data'),
      solutionOptions: _.get(experience, 'recent_iterations.draft.solution_options'),
      visitor: {},
      also: [],
      templates: _.get(experienceMeta, 'xp.templates') || []
    }
  }), null, 2)
  return files
}

function normalizeDate (str) {
  let date = new Date(str)
  date.setSeconds(date.getSeconds(), 0)
  return date
}

function setCode (experience, files) {
  experience = _.cloneDeep(experience)
  const pkg = JSON.parse(files['package.json'])
  experience.name = _.get(pkg, 'meta.name')
  _.set(experience, 'recent_iterations.draft.url', _.get(pkg, 'meta.previewUrl'))
  delete pkg.meta
  _.set(experience, 'recent_iterations.draft.package_json', JSON.stringify(pkg, null, 2))
  return experience
}

module.exports = { getCode, setCode }
