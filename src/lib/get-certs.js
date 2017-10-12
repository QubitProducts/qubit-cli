const fs = require('fs-extra')
const installCerts = require('./install-certs')
const {CERT_PATH, KEY_PATH, CERT_DIR} = require('./constants')
const ms = require('ms')
const ENOENT = 'ENOENT'

module.exports = async function getCerts (isRetry) {
  try {
    let [certExpired, keyExpired] = await Promise.all([expired(KEY_PATH), expired(CERT_PATH)])
    if (certExpired || keyExpired) {
      await fs.remove(CERT_DIR)
      return installCerts().then(() => getCerts())
    }
    const [key, cert] = await Promise.all([
      fs.readFile(KEY_PATH),
      fs.readFile(CERT_PATH)
    ])
    return { key, cert }
  } catch (err) {
    if (err instanceof Error && err.code === ENOENT) {
      if (!isRetry) return installCerts().then(() => getCerts(true))
      throw new Error(`No self-signed certificates were found in ${CERT_DIR}, and Qubit-CLI could not automatically solve this.`)
    }
    throw err
  }
}

async function expired (path) {
  let stat = await fs.stat(path)
  let createdAt = stat.birthtime || stat.ctime
  let oneYearAgo = Date.now() - ms('360 days')
  // if createdAt is before 1 year ago
  return (createdAt <= oneYearAgo)
}
