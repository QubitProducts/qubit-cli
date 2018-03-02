const experienceState = {}
const _ = require('slapdash')
const getBrowserState = require('@qubit/jolt/lib/getBrowserState')
const defaultVisitor = require('./visitor')
const log = require('./log')
const resolve = require('sync-p/resolve')
const uv = require('./uv')()
const jolt = require('./jolt')()

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

  function getInclude () {
    let include = _.get(pkg, `meta.include`)
    if (typeof include !== 'undefined') return include
    include = _.get(pkg, `meta.also`)
    if (typeof include !== 'undefined') return include
    return []
  }

  return {
    include: getInclude(),
    exclude: _.get(pkg, `meta.exclude`),
    api: {
      data: meta.templateData,
      emitCustomGoal: (id, options) => log.info('Custom goal emitted', { id, options }),
      solution: meta.solutionOptions,
      state: {
        get: get,
        set: set
      },
      log,
      getVisitorState: () => resolve(_.assign({}, visitor)),
      getBrowserState: () => resolve(getBrowserState()),
      uv: {
        emit: uv.emit,
        events: jolt.events,
        on: jolt.onEnrichment,
        once: jolt.onceEnrichment,
        onEventSent: jolt.onSuccess,
        onceEventSent: jolt.onceSuccess
      },
      meta: {
        cookieDomain: meta.cookieDomain || window.location.host,
        trackingId: meta.trackingId || 'tracking_id',
        // preferred
        experienceId: meta.experimentId || meta.experienceId,
        // deprecated
        experimentId: meta.experimentId || meta.experienceId,
        isPreview: meta.isPreview !== false,
        vertical: meta.vertical || 'vertical',
        namespace: meta.namespace || null,
        iterationId: meta.iterationId,
        variationId: meta.variationId,
        variationMasterId: meta.variationMasterId,
        variationIsControl: meta.variationIsControl,
        visitorId: visitor.visitorId
      }
    }
  }
}
