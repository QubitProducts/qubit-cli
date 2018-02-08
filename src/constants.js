const defaults = require('@qubit/experience-defaults').custom
const os = require('os')
const path = require('path')
const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const CERT_DIR = path.join(HOME, '.qubit-ssl')
const CERT_PATH = path.join(CERT_DIR, 'qubit-serve.crt')
const KEY_PATH = path.join(CERT_DIR, 'qubit-serve.key')
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

const EXECUTION = defaults.execution_code
const GLOBAL = defaults.global_code
const COMMON = defaults.common_code
const TRIGGERS = defaults.activation_rules
const CSS = defaults.custom_styles
const SCHEMA = defaults.schema

module.exports = {
  HOME,
  CERT_DIR,
  CERT_PATH,
  KEY_PATH,
  KEY_OPTIONS,
  EXECUTION,
  CSS,
  SCHEMA,
  GLOBAL,
  COMMON,
  TRIGGERS,
  QUBITRC,
  NPMRC,
  ID_TOKEN,
  APP_TOKEN,
  REGISTRY_TOKEN,
  REGISTRY_SCOPES
}
