const microAmd = require('micro-amd')
const map = {
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
  '@qubit/poller': require('@qubit/poller'),
  '@qubit/remember-preview': noop,
  '@qubit/send-uv-event': require('@qubit/send-uv-event'),
  '@qubit/stash-count': require('@qubit/stash-count'),
  '@qubit/uv-api': require('@qubit/uv-api'),
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
  window.__qubit.cli = window.__qubit.cli || {}
  window.__qubit.cli.amd = amd
  Object.defineProperty(window.__qubit, 'amd', { get: () => amd })
  return amd
}

function noop () {}
