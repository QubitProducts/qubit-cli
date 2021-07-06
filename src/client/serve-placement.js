const { createExecutioner } = require('@qubit/placement-engine/lib/executioner')
const evaluateTriggers = require('@qubit/placement-engine/lib/evaluateTriggers')
const API = require('@qubit/placement-engine/lib/API')
const applyStyles = require('./styles')
const getJolt = require('./jolt')
const getUv = require('./uv')
const logger = require('./logger')
const getCookieDomain = require('./get-cookie-domain')
const applyPreviewSettings = require('./preview-settings')
const disposables = []
const { VIEW_REGEX } = require('@qubit/placement-engine/lib/constants')
let disposeViewListener = () => {}

servePlacement()

module.hot.accept(['placement.less'], () => {
  const styleElement = document.getElementById('qubit-cli-placement-styles')
  if (styleElement) {
    styleElement.innerHTML = require('placement.less')
  }
})

module.hot.accept(
  ['placement.js', 'payload.json', 'package.json'],
  (...args) => {
    disposeViewListener()
    // If the only disposable is the styles
    // there is no code to remove any side effects
    // so we have to reload the page
    if (disposables.length === 1) {
      return window.location.reload()
    }
    while (disposables.length) disposables.pop()()
    servePlacement()
  }
)

function servePlacement () {
  const packageJson = require('package.json')
  const {
    placementId,
    propertyId,
    trackingId,
    namespace,
    vertical,
    visitorId = 'visitorId',
    domains,
    triggers
  } = packageJson.meta || {}

  const cookieDomain = getCookieDomain(domains)

  applyPreviewSettings(cookieDomain, {
    exclude: [placementId]
  })

  const code = {
    js: require('placement.js'),
    css: function () {
      let remove
      const add = () => {
        remove = applyStyles(
          'qubit-cli-placement-styles',
          require('placement.less')
        )
      }
      add()
      return { add, remove }
    },
    triggers
  }
  const payload = require('payload.json')

  const config = {
    propertyId,
    cookieDomain,
    qpNamespace: namespace,
    trackingId,
    propertyVertical: vertical
  }
  const context = {
    jolt: getJolt(),
    uv: getUv(),
    biscotti: {
      permanent: {
        get: () => visitorId
      }
    },
    log: logger
  }

  const api = API.create(placementId, { placementId }, config, context)

  api.onRemove = dispose => {
    disposables.push(() => {
      try {
        dispose()
      } catch (err) {
        api.log.error(err)
      }
    })
  }

  return api.getBrowserState().then(({ ua }) => {
    const { replay, dispose } = context.uv.on(VIEW_REGEX, viewEvent => {
      while (disposables.length) disposables.pop()()
      placementEngine({ ua, viewEvent, url: window.location.href })
    })
    disposeViewListener = dispose
    replay()
    return dispose
  })

  function placementEngine (context) {
    const pass = evaluateTriggers(code.triggers, api, context)
    if (!pass) return

    return createExecutioner(code, api)({
      content: payload,
      onImpression: () => api.log.info('onImpression called'),
      onClickthrough: () => api.log.info('onClickthrough called')
    }).catch(api.log.error)
  }
}
