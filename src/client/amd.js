const microAmd = require('micro-amd')
const map = {
  '@qubit/biscotti': require('@qubit/biscotti'),
  '@qubit/email-scheduler': require('@qubit/email-scheduler'),
  '@qubit/exit-checker': require('@qubit/exit-checker'),
  '@qubit/jquery': require('@qubit/jquery'),
  '@qubit/mvt': require('@qubit/mvt'),
  '@qubit/poller': require('@qubit/poller'),
  '@qubit/remember-preview': require('./remember-preview'),
  '@qubit/send-uv-event': require('@qubit/send-uv-event'),
  '@qubit/social-proof': require('@qubit/social-proof'),
  '@qubit/stash-count': require('@qubit/stash-count'),
  '@qubit/uv-api': require('@qubit/uv-api'),
  'cookieman': require('cookieman'),
  'jquery': require('@qubit/jquery')
}

module.exports = function createAMD () {
  const amd = microAmd({ base: '//d22rutvoghj3db.cloudfront.net/' })
  for (let id in map) if (map.hasOwnProperty(id)) amd.define(id, () => map[id])
  return amd
}
