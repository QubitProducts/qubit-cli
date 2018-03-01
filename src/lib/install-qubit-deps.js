const path = require('path')
const execa = require('execa')
const login = require('../server/lib/login')
const log = require('./log')

module.exports = async function installQubitDeps () {
  try {
    let deps = require('qubit-cli-deps')
    if (!deps.hasQubitDeps) throw new Error('oh noes!')
  } catch (err) {
    log.info(`Setting up Qubit-CLI, this may take a few mins`)
    await login()
    log.info('Installing some additional dependencies...')
    await execa('npm', ['install', './deps', '--production', '--no-save'], {
      cwd: path.resolve(__dirname, '../../'),
      stdio: 'inherit'
    })
    log.info('Additional installation steps complete!')
  }
}
