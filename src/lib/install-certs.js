const fs = require('fs-promise')
const pem = require('pem')
const childProcess = require('child_process')
const mkdirp = require('mkdirp-promise')
const log = require('./log')
const {CERT_DIR, CERT_PATH, KEY_PATH, KEY_OPTIONS} = require('./constants')

module.exports = function setup () {
  log("We'll now generate a TSL certificate and install it into your OS as a trusted certificate")
  log("This is to make sure that browsers don't block xp from https sites")
  log('You will be asked for your sudo password')
  log("If you'd like to inspect/remove the installed certificate, you can find it in your keychain")

  return mkdirp(CERT_DIR)
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
      var certDir
      var updateCmd

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
    childProcess.exec(cmd, function (error, stdout, stderr) {
      if (error) {
        return reject(new Error(['Could not install certificate:', stdout, stderr].join('\n\n')))
      }
      log('All done!')
      log('The certificate has been created in ' + CERT_DIR)
      log('and has been added to your system as a trusted certificate.')
      resolve()
    })
  })
}
