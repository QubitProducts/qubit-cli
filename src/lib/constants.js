const path = require('path')
const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const CERT_DIR = path.join(HOME, '.qubitcert')
const CERT_PATH = path.join(CERT_DIR, 'qubit_serve.crt')
const KEY_PATH = path.join(CERT_DIR, 'qubit_serve.key')
const KEY_OPTIONS = { days: 365, selfSigned: true, organization: 'Qubit' }

module.exports = { HOME, CERT_DIR, CERT_PATH, KEY_PATH, KEY_OPTIONS }
