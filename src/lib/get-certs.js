const fs = require('fs-extra')
const installCerts = require('./install-certs')
const {CERT_PATH, KEY_PATH, CERT_DIR} = require('./constants')

module.exports = async function getCerts (isRetry) {
  try {
    const [key, cert] = await Promise.all([ fs.readFile(KEY_PATH), fs.readFile(CERT_PATH) ])
    return { key, cert }
  } catch (err) {
    if (err instanceof Error && err.code === 'ENOENT') {
      if (!isRetry) return installCerts().then(() => getCerts(true))
      throw new Error(`No self-signed certificates were found in ${CERT_DIR}, and xp-cli could not automatically solve this.`)
    }
    throw err
  }
}
