const installCerts = require('../lib/install-certs')

module.exports = async function installCertsCmd () {
  await installCerts()
}
