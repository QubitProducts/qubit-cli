const fs = require('fs-extra')
const pem = require('pem')
const childProcess = require('child_process')
const log = require('./log')
const { CERT_DIR, CERT_PATH, KEY_PATH, KEY_OPTIONS } = require('../constants')

module.exports = function setup () {
  log.info("We'll now generate a TSL certificate and install it into your OS as a trusted certificate")
  log.info("This is to make sure that browsers don't block Qubit-CLI from serving to https sites")
  log.info('You will be asked for your sudo password')
  log.info("If you'd like to inspect/remove the installed certificate, you can find it in your keychain")

  return fs.mkdirp(CERT_DIR)
    .then(createCerts)
    .then(saveCerts)
    .then(chmodCerts)
    .then(installCerts)
}

function createCerts () {
  return new Promise(function (resolve, reject) {
    pem.createCertificate(KEY_OPTIONS, function (err, keys) {
      if (err) return reject(err)
      else resolve(keys)
    })
  })
}

function saveCerts (certs) {
  return Promise.all([
    fs.writeFile(KEY_PATH, certs.serviceKey),
    fs.writeFile(CERT_PATH, certs.certificate)
  ])
}

function chmodCerts (certs) {
  return Promise.all([
    fs.chmod(KEY_PATH, '600'),
    fs.chmod(CERT_PATH, '600')
  ])
}

function installCerts () {
  let cmd
  switch (process.platform) {
    case 'darwin':
      cmd = 'sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ' + CERT_PATH
      break
    case 'linux':
      let certDir
      let updateCmd

      if (childProcess.spawnSync('which', ['update-ca-certificates']).status === 0) {
        certDir = '/usr/local/share/ca-certificates'
        updateCmd = 'update-ca-certificates'
      } else {
        certDir = '/etc/ca-certificates/trust-source/anchors'
        updateCmd = 'trust extract-compat'
      }

      cmd = ['sudo mkdir -p', certDir, '&& sudo cp', CERT_PATH, certDir, '&& sudo', updateCmd].join(' ')
      break
  }
  return new Promise(function (resolve, reject) {
    childProcess.exec(cmd, async function (error, stdout, stderr) {
      if (error || stderr) {
        await fs.remove(CERT_DIR)
        log.error('Could not install certificates')
        process.exit()
      }
      log.info('All done!')
      log.info('The certificate has been created in ' + CERT_DIR + 'and has been added to your system as a trusted certificate.')
      resolve()
    })
  })
}
