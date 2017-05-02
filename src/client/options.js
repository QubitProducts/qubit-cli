const experienceState = {}
const _ = require('lodash')
const getBrowserState = require('@qubit/jolt/lib/getBrowserState')
const defaultVisitor = require('./visitor')
const log = require('./log')
const resolve = require('sync-p/resolve')

module.exports = function transform (pkg, key) {
  const variationOpts = _.get(pkg, `meta.variations.${key}`) || {}
  const meta = Object.assign({}, pkg.meta, variationOpts)
  const visitor = Object.assign({}, defaultVisitor(), _.get(pkg, 'meta.visitor'))

  function set (key, data) {
    experienceState[key] = data
  }

  function get (key) {
    return experienceState[key]
  }

  delete meta.variations

  meta.experimentId = meta.experimentId || meta.experienceId
  meta.experienceId = meta.experimentId
  meta.cookieDomain = meta.cookieDomain || window.location.host
  meta.trackingId = meta.trackingId || 'tracking_id'
  meta.vertical = meta.vertical || 'vertical'
  meta.namespace = meta.namespace || undefined
  meta.visitorId = visitor.visitorId
  meta.isPreview = true

  return {
    also: _.get(pkg, `meta.also`) || [],
    api: {
      state: {
        get: get,
        set: set
      },
      emitCustomGoal: (id, options) => log.info('Custom goal emitted', { id, options }),
      getBrowserState: () => resolve(getBrowserState()),
      getVisitorState: () => resolve(_.cloneDeep(visitor)),
      log,
      solution: pkg.meta.solutionOptions,
      meta: _.pick(meta, [
        'cookieDomain',
        'trackingId',
        'experienceId',
        'experimentId',
        'isPreview',
        'vertical',
        'namespace',
        'iterationId',
        'variationId',
        'variationMasterId',
        'variationIsControl',
        'visitorId'
      ])
    }
  }
}
