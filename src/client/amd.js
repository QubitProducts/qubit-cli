const _ = require('lodash')
const microAmd = require('micro-amd')
const map = {
  '@qubit/http-api-tally': require('@qubit/http-api-tally'),
  '@qubit/advanced-modal': require('@qubit/advanced-modal'),
  '@qubit/biscotti': require('@qubit/biscotti'),
  '@qubit/email-scheduler': require('@qubit/email-scheduler'),
  '@qubit/exit-checker': require('@qubit/exit-checker'),
  '@qubit/floating-panel': require('@qubit/floating-panel'),
  '@qubit/growl': require('@qubit/growl'),
  '@qubit/image-carousel': require('@qubit/image-carousel'),
  '@qubit/jquery': require('@qubit/jquery'),
  '@qubit/mvt': require('@qubit/mvt'),
  '@qubit/poller': require('@qubit/poller'),
  '@qubit/product-recommendations': require('@qubit/product-recommendations'),
  '@qubit/remember-preview': _.noop,
  '@qubit/send-uv-event': require('@qubit/send-uv-event'),
  '@qubit/social-proof': require('@qubit/social-proof'),
  '@qubit/stash-count': require('@qubit/stash-count'),
  '@qubit/uv-api': require('@qubit/uv-api'),
  '@qubit/visitor-pulse': require('@qubit/visitor-pulse'),
  'cookieman': require('cookieman'),
  'preact': require('preact'),
  'jquery': require('@qubit/jquery'),
  'sync-p': require('sync-p/extra'),
  'slapdash': require('slapdash')
}

module.exports = function createAMD () {
  const amd = microAmd({ base: '//d22rutvoghj3db.cloudfront.net/' })
  for (let id in map) if (map.hasOwnProperty(id)) amd.define(id, () => map[id])
  _.set(window, '__qubit.xp.amd', amd)
  Object.defineProperty(window.__qubit, 'amd', { get: () => amd })
  return amd
}
