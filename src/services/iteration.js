const _ = require('lodash')
const fetch = require('../lib/fetch')
const hasNoCode = require('../lib/hasNoCode')
const { GLOBAL, COMMON, TRIGGERS, SCHEMA } = require('../lib/constants')

const iterationsUrl = iterationId => `/api/iterations/${iterationId}`

function get (iterationId) {
  return fetch.get(iterationsUrl(iterationId))
}

function set (iterationId, iteration) {
  delete iteration.update_sequence_id
  if (_.isString(iteration.schema)) iteration.schema = JSON.parse(iteration.schema)
  return fetch.put(iterationsUrl(iterationId), { iteration: iteration })
}

function getCode (iteration) {
  const rules = iteration.activation_rules
  const rule = rules && rules.find(rule => rule.key === 'custom_javascript')
  const triggers = rule && rule.value
  const globalCode = iteration.global_code
  const commonCode = iteration.common_code
  const schema = iteration.schema

  return {
    'global.js': hasNoCode(globalCode) ? GLOBAL : globalCode,
    'triggers.js': hasNoCode(triggers) ? TRIGGERS : triggers,
    'fields.json': hasNoCode(schema) ? SCHEMA : schema,
    'common.js': hasNoCode(commonCode) ? COMMON : commonCode
  }
}

function setCode (iteration, files) {
  iteration = _.cloneDeep(iteration)
  const rules = iteration.activation_rules || []
  const customJs = rules.find(rule => rule.key === 'custom_javascript')
  if (customJs) {
    customJs.value = hasNoCode(files['triggers.js']) ? TRIGGERS : files['triggers.js']
  } else {
    rules.push({
      key: 'custom_javascript',
      type: 'code',
      value: hasNoCode(files['triggers.js']) ? TRIGGERS : files['triggers.js']
    })
  }
  Object.assign(iteration, {
    global_code: files['global.js'] || GLOBAL,
    common_code: files['common.js'] || COMMON,
    schema: files['fields.json'] || SCHEMA,
    activation_rules: rules
  })
  return iteration
}

module.exports = { get, set, getCode, setCode }
