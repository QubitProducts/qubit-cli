const microAmd = require('micro-amd')
const map = {
  '@qubit/abandonment-recovery': require('@qubit/abandonment-recovery'),
  '@qubit/datasets': require('@qubit/datasets'),
  '@qubit/advanced-modal': require('@qubit/advanced-modal'),
  '@qubit/email-scheduler': require('@qubit/email-scheduler'),
  '@qubit/exit-checker': require('@qubit/exit-checker'),
  '@qubit/floating-panel': require('@qubit/floating-panel'),
  '@qubit/growl': require('@qubit/growl'),
  '@qubit/http-api-tally': require('@qubit/http-api-tally'),
  '@qubit/http-api-stash': require('@qubit/http-api-stash'),
  '@qubit/image-carousel': require('@qubit/image-carousel'),
  '@qubit/message-scheduler': require('@qubit/message-scheduler'),
  '@qubit/jquery': require('@qubit/jquery'),
  '@qubit/mvt': require('@qubit/mvt'),
  '@qubit/poller': require('@qubit/poller'),
  '@qubit/product-recommendations': require('@qubit/product-recommendations'),
  '@qubit/remember-preview': noop,
  '@qubit/send-uv-event': require('@qubit/send-uv-event'),
  '@qubit/social-proof': require('@qubit/social-proof'),
  '@qubit/stash-count': require('@qubit/stash-count'),
  '@qubit/uv-api': require('@qubit/uv-api'),
  '@qubit/visitor-pulse': require('@qubit/visitor-pulse'),
  'cookieman': require('cookieman'),
  'jquery': require('@qubit/jquery'),
  'preact': require('preact'),
  'slapdash': require('slapdash'),
  'sync-p': require('sync-p/extra'),
  'qubit-react/experience': require('qubit-react/experience')
}

module.exports = function createAMD () {
  const amd = microAmd({ base: '//d22rutvoghj3db.cloudfront.net/' })
  for (let id in map) if (map.hasOwnProperty(id)) amd.define(id, () => map[id])
  window.__qubit = window.__qubit || {}
  window.__qubit.xp = window.__qubit.xp || {}
  window.__qubit.xp.amd = amd
  Object.defineProperty(window.__qubit, 'amd', { get: () => amd })
  return amd
}

function noop () {}
