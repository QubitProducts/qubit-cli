const { createExecutioner } = require('@qubit/placement-engine/lib/executioner')
const API = require('@qubit/placement-engine/lib/API')
const applyStyles = require('./styles')
const getJolt = require('./jolt')
const getUv = require('./uv')
const logger = require('./logger')
const getCookieDomain = require('./get-cookie-domain')
const disposables = []

servePlacement()

module.hot.accept([
  'placement.less'
], () => {
  applyStyles('qubit-cli-placement-styles', require('placement.less'))
})

module.hot.accept([
  'placement.js',
  'payload.json',
  'package.json'
], (...args) => {
  // If the only disposable is the styles
  // there is no code to remove any side effects
  // so we have to reload the page
  if (disposables.length === 1) {
    return window.location.reload()
  }
  flush(disposables)
  servePlacement()
})

function servePlacement () {
  const packageJson = require('package.json')
  const code = {
    js: require('placement.js'),
    css: function () {
      let remove
      let add = () => {
        remove = applyStyles('qubit-cli-placement-styles', require('placement.less'))
      }
      add()
      return { add, remove }
    }
  }
  const payload = require('payload.json')

  const {
    placementId,
    propertyId,
    trackingId,
    namespace,
    vertical,
    visitorId = 'visitorId'
  } = packageJson.meta || {}

  const config = {
    propertyId,
    cookieDomain: getCookieDomain(packageJson.meta.domains),
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

  return createExecutioner(code, api)({
    content: payload,
    onImpression: () => api.log.trace('onImpression called'),
    onClickthrough: () => api.log.trace('onClickthrough called')
  })
}

function flush (disposables) {
  while (disposables.length) disposables.pop()()
}
