const os = require('os')
const path = require('path')
const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const CERT_DIR = path.join(HOME, '.qubitcert')
const CERT_PATH = path.join(CERT_DIR, 'qubit_serve.crt')
const KEY_PATH = path.join(CERT_DIR, 'qubit_serve.key')
const EXECUTION = 'function execution (options) { // eslint-disable-line no-unused-vars\n\n}\n'
const GLOBAL = ''
const TRIGGERS = 'function triggers (options, cb) { // eslint-disable-line no-unused-vars\n  cb()\n}\n'
const CSS = ''
const KEY_OPTIONS = {
  days: 365,
  selfSigned: true,
  organization: 'Qubit',
  commonName: 'localhost',
  altNames: ['localhost']
}
const QUBITRC = `${os.homedir()}/.qubitrc`
const NPMRC = `${os.homedir()}/.npmrc`
const ID_TOKEN = 'ID_TOKEN'
const APP_TOKEN = 'APP_TOKEN'
const REGISTRY_TOKEN = 'REGISTRY_TOKEN'
const REGISTRY_SCOPES = 'REGISTRY_SCOPES'

module.exports = {
  HOME,
  CERT_DIR,
  CERT_PATH,
  KEY_PATH,
  KEY_OPTIONS,
  EXECUTION,
  CSS,
  GLOBAL,
  TRIGGERS,
  QUBITRC,
  NPMRC,
  ID_TOKEN,
  APP_TOKEN,
  REGISTRY_TOKEN,
  REGISTRY_SCOPES
}
