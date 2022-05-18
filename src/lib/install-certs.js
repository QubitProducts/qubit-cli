const pem = require('pem')
const opn = require('opn')
const { exec } = require('child_process')
const execa = require('execa')
const fs = require('fs-extra')
const windosu = require('windosu')
const confirm = require('confirmer')
const which = require('which')
const semverbs = require('semverbs')
const childProcess = require('child_process')
const log = require('./log')
const { CERT_DIR, CERT_PATH, KEY_PATH, KEY_OPTIONS } = require('../constants')

module.exports = async function setup () {
  log.info(
    "We'll now generate a TSL certificate and install it into your OS as a trusted certificate"
  )
  log.info(
    "This is to make sure that browsers don't block Qubit-CLI from serving to https sites"
  )
  log.info('You will be asked for your sudo password')
  if (process.platform === 'win32') {
    const result = await new Promise(resolve => {
      which(process.env.OPENSSL_BIN || 'openssl', (err, path) => resolve(!err))
    })

    if (!result) {
      log.error(
        `openssl not found on your system at this path: "${process.env
          .OPENSSL_BIN || 'openssl'}".`
      )
      log.error(
        'Please download and install a recent version from https://slproweb.com/products/Win32OpenSSL.html and add it to your system path'
      )
      throw new Error('openssl not found')
    } else {
      const { stdout } = await execa('openssl', ['version'])
      const [version] = (stdout || '').match(/\d+\.\d+\.\d+/) || []
      if (!version) {
        log.warn('Could not determine openssl version')
        log.warn(
          'If this command fails try running qubit-cli from a cgywin terminal'
        )
      } else if (semverbs.lt(version, '1.1.1')) {
        log.warn(`You have an old version of openssl installed: ${version}.`)
        log.warn(
          'Please download and install a recent version from https://slproweb.com/products/Win32OpenSSL.html and add it to your system path'
        )
      }
    }
  }

  return fs
    .mkdirp(CERT_DIR)
    .then(createCerts)
    .then(saveCerts)
    .then(chmodCerts)
    .then(installCerts)
    .catch(async err => {
      log.error(err)
      await fs.remove(CERT_DIR)
      throw err
    })
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
  return Promise.all([fs.chmod(KEY_PATH, '600'), fs.chmod(CERT_PATH, '600')])
}

async function installCerts () {
  try {
    if (process.platform === 'darwin') await installCertsOSX()
    else if (process.platform === 'linux') await installCertsLinux()
    else if (process.platform === 'win32') await installCertsWin()
    log.info('All done!')
    log.info(
      'The certificate has been created in ' +
        CERT_DIR +
        'and has been added to your system as a trusted certificate.'
    )
  } catch (err) {
    log.error(err)
    log.error('Could not install certificates automatically')
    const result = await confirm('Would you like to install them manually?')
    if (result) {
      if (process.platform === 'win32') {
        log.info(
          `Please add "${CERT_PATH}" to your machine's 'Trusted Root Certification Authority'`
        )
      } else if (process.platform === 'darwin') {
        log.info(
          `Please double click on "${CERT_PATH}", install it to your keychain and then set it's trust settings to 'always trust'`
        )
      }
      await opn(CERT_DIR)
    } else {
      await fs.remove(CERT_DIR)
    }
    process.exit()
  }
}

async function installCertsOSX () {
  await execa.shell(
    'security set-keychain-settings -t 3600 -l ~/Library/Keychains/login.keychain'
  )
  return rawExec(
    `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${CERT_PATH}"`
  )
}

async function installCertsLinux () {
  let certDir
  let updateCmd

  if (
    childProcess.spawnSync('which', ['update-ca-certificates']).status === 0
  ) {
    certDir = '/usr/local/share/ca-certificates'
    updateCmd = 'sudo update-ca-certificates'
  } else {
    certDir = '/etc/ca-certificates/trust-source/anchors'
    updateCmd = 'sudo trust extract-compat'
  }
  await fs.ensureDir(certDir)
  await fs.copy(CERT_PATH, certDir)
  return rawExec(updateCmd)
}

function installCertsWin () {
  return windosu.exec(
    `certutil -addstore -enterprise -f -v root "${CERT_PATH}"`
  )
}

const rawExec = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        return reject(err)
      }
      return resolve(stdout)
    })
  })
