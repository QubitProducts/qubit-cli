var fs = require('fs-promise')
var path = require('path')
var os = require('os')
var setupCertificates = require('qubit-cli/lib/commands/setup').execute
var qubitCertDir = path.resolve(os.homedir(), '.qubitcert')
var keyPath = path.join(qubitCertDir, 'qubit_serve.key')
var certPath = path.join(qubitCertDir, 'qubit_serve.crt')

function getCertificates (failedPreviously) {
  return Promise.all([
    fs.readFile(keyPath),
    fs.readFile(certPath)
  ]).then(function onSuccess (certs) {
    var https = {
      key: certs[0],
      cert: certs[1]
    }
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
