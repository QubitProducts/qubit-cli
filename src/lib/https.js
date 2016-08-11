const fs = require('fs-promise')
const path = require('path')
const os = require('os')
const setupCertificates = require('qubit-cli/lib/commands/setup').execute
const qubitCertDir = path.resolve(os.homedir(), '.qubitcert')
const keyPath = path.join(qubitCertDir, 'qubit_serve.key')
const certPath = path.join(qubitCertDir, 'qubit_serve.crt')

function getCertificates (failedPreviously) {
  return Promise.all([
    fs.readFile(keyPath),
    fs.readFile(certPath)
  ]).then(function onSuccess ([ key, cert ]) {
    let https = { key, cert }
    // Prevent webpack-dev-server from overriding our empty `ca` property
    Object.defineProperty(https, 'ca', {
      get: function () { return undefined },
      set: function () {}
    })
    return https
  }, function onError (error) {
    if (error instanceof Error && error.code === 'ENOENT') {
      if (!failedPreviously) {
        return setupCertificates().then(() => getCertificates(true))
      } else {
        throw new Error('No self-signed certificates were found in ' + qubitCertDir + ', and xp-cli could not automatically solve this.')
      }
    }
    throw error
  })
}

module.exports = getCertificates
