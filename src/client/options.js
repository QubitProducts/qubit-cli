const experienceState = {}
const _ = require('slapdash')
const getBrowserState = require('@qubit/jolt/lib/getBrowserState')
const qubitReact = require('qubit-react/experience')
const defaultVisitor = require('./visitor')
const redirectTo = require('./redirect-to')
const logger = require('./logger')
const poller = require('@qubit/poller')
const resolve = require('sync-p/resolve')
const createEmitMetric = require('./emit-metric')
const createEmitCustomGoal = require('./emit-custom-goal')
const createCookieApi = require('./create-cookie-api')
const getCookieDomain = require('./get-cookie-domain')
const uv = require('./uv')()
const jolt = require('./jolt')()
const createHooks = require('./hooks')
const createIntegrationApi = require('./integrations')

module.exports = function transform (pkg, key) {
  const { addHooks, runHooks, hasHooks } = createHooks()
  const variationOpts = _.get(pkg, `meta.variations.${key}`) || {}
  const meta = Object.assign({}, pkg.meta, variationOpts)
  const segments = meta.segments || []
  const visitor = Object.assign(
    {},
    defaultVisitor(),
    _.get(pkg, 'meta.visitor')
  )
  const experienceMeta = {
    cookieDomain:
      meta.cookieDomain || meta.domains
        ? getCookieDomain(meta.domains)
        : window.location.host,
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
  const react = qubitReact({
    owner: experienceMeta.experimentId
  })

  function set (key, data) {
    experienceState[key] = data
  }

  function get (key) {
    return experienceState[key]
  }

  function getInclude () {
    let include = _.get(pkg, 'meta.include')
    if (typeof include !== 'undefined') return include
    include = _.get(pkg, 'meta.also')
    if (typeof include !== 'undefined') return include
    return []
  }

  return {
    addHooks,
    runHooks,
    hasHooks,
    include: getInclude(),
    exclude: _.get(pkg, 'meta.exclude'),
    meta: experienceMeta,
    createApi: function createApi (name) {
      const log = logger(name)
      addHooks(name, 'remove', react.release)
      return {
        data: meta.templateData,
        emitCustomGoal: createEmitCustomGoal(
          uv,
          experienceMeta,
          _.get(pkg, 'meta.customGoals'),
          log
        ),
        emitMetric: createEmitMetric(uv, experienceMeta, log),
        solution: meta.solutionOptions,
        state: {
          get: get,
          set: set
        },
        cookies: createCookieApi(experienceMeta.cookieDomain),
        react: _.pick(
          react,
          name === 'triggers'
            ? ['register', 'release']
            : ['getReact', 'render', 'release']
        ),
        log: log,
        getVisitorState: () => resolve({ ...visitor }),
        getBrowserState: () => resolve(getBrowserState()),
        uv: {
          emit: uv.emit,
          events: jolt.events,
          on: jolt.onEnrichment,
          once: jolt.onceEnrichment,
          onEventSent: jolt.onSuccess,
          onceEventSent: jolt.onceSuccess
        },
        meta: experienceMeta,
        poll: function poll (targets, options) {
          return poller(targets, {
            logger: logger,
            stopOnError: true,
            ...options
          })
        },
        redirectTo: redirectTo,
        isMemberOf: segment => resolve(segments.includes(segment)),
        getMemberships: () => resolve(segments),
        // This is a no-op for now, can't think of a decent way to polyfill this
        // behaviour. We can look into it more if users ask for it.
        onMembershipsChanged: () => ({ dispose: () => {} }),
        registerContentAreas: () => {},
        unregisterContentAreas: () => {},
        onRemove: fn => addHooks(name, 'remove', fn),
        onActivation: fn => addHooks(name, 'onActivation', fn),
        integration: createIntegrationApi(
          visitor.visitorId,
          experienceMeta,
          _.get(pkg, 'meta.qfns'),
          log
        )
      }
    }
  }
}
