const _ = require('lodash')
const { btoa } = require('b2a')
const { getFilename } = require('./variation')

function getCode (property, experience, iteration, goals, qfns, variations) {
  const isTemplate = Boolean(experience.is_template)
  const type = isTemplate ? 'template' : 'experience'
  const files = {}
  const experienceMeta = experience.meta ? JSON.parse(experience.meta) : {}
  // TODO: remove this conditional once API returns parsed package_json
  const pkgJSON = iteration.package_json
    ? _.isString(iteration.package_json)
        ? JSON.parse(iteration.package_json)
        : iteration.package_json
    : {}
  files['package.json'] = JSON.stringify(
    Object.assign(
      {
        name: `qubit-${type}-${experience.id}`,
        version: '1.0.0',
        description: `${type} powered by qubit`
      },
      pkgJSON,
      {
        meta: {
          name: experience.name,
          propertyId: experience.property_id,
          trackingId: property.tracking_id,
          vertical: property.vertical,
          namespace: property.qp_namespace,
          domains: property.domains,
          experienceId: experience.id,
          iterationId: iteration.id,
          previewUrl: iteration.url,
          remoteUpdatedAt: normalizeDate(iteration.updated_at),
          variations: variations.reduce((memo, variation) => {
            memo[getFilename(variation)] = {
              variationId: variation.id,
              variationIsControl: variation.is_control,
              variationMasterId: variation.master_id,
              remoteUpdatedAt: normalizeDate(variation.updated_at)
            }
            return memo
          }, {}),
          customGoals: goals
            .map(g => {
              return {
                goalId: g.id,
                key: g.key,
                value: g.value
              }
            })
            .filter(g => g.key === 'pageviews.customvalues.uv.events.action'),
          qfns: getQfns(experience.property_id, qfns),
          templateData: iteration.template_data || {},
          solutionOptions: iteration.solution_options,
          visitor: {},
          isPreview: true,
          isTemplate: isTemplate,
          include: [],
          exclude: [],
          segments: [],
          templates: _.get(experienceMeta, 'cli.templates') || []
        }
      }
    ),
    null,
    2
  )
  return files
}

function normalizeDate (str) {
  const date = new Date(str)
  date.setSeconds(date.getSeconds(), 0)
  return date
}

function setCode (experience, iteration, files) {
  const pkg = JSON.parse(files['package.json'])
  experience = _.cloneDeep(experience)
  experience.name = _.get(pkg, 'meta.name')
  iteration = _.cloneDeep(iteration)
  iteration.url = _.get(pkg, 'meta.previewUrl')
  iteration.package_json = _.omit(pkg, 'meta')
  // We don't want to override template data which was set by the marketer
  return { experience, iteration }
}

function getQfns (propertyId, qfns) {
  return _.reduce(
    qfns,
    (memo, qfn) => {
      return {
        ...memo,
        [qfn.friendlyId]: btoa(
          `${propertyId}:${qfn.friendlyId}:${qfn.majorVersion}`
        )
      }
    },
    {}
  )
}

module.exports = { getCode, setCode }
