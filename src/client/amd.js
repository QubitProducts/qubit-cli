var fetchJS = require('fetch-js')

module.exports = function (cb) {
  var url = 'https://modules.qubitproducts.com/require.js?dependencies=' +
  [
    '@qubit/email-scheduler@*',
    '@qubit/poller@*',
    '@qubit/send-uv-event@*',
    'cookieman@*',
    '@qubit/jquery@*',
    '@qubit/exit-checker@*',
    '@qubit/mvt@*',
    '@qubit/uv-api@*',
    '@qubit/social-proof@*',
    '@qubit/stash-count@*',
    '@qubit/biscotti@*'
  ].join(',')
  fetchJS(url, function () {
    window.__qubit.amd.define('@qubit/remember-preview', function () {
      return noop
    })
    cb()
  })
}

function noop () {}
