const path = require('path')
const execa = require('execa')
const login = require('../server/lib/login')
const log = require('./log')

module.exports = async function installQubitDeps () {
  log.info(`Setting up qubit-cli, this may take a few mins`)
  await login()
  log.info('Installing some additional dependencies...')
  try {
    await execa('yarn', ['add', './deps', '--production', '--non-interactive', '--no-lockfile', '--no-progress'], {
      cwd: path.resolve(__dirname, '../../')
    })
  } catch (err) {
    await execa('npm', ['install', './deps', '--production', '--no-save'], {
      cwd: path.resolve(__dirname, '../../')
    })
  }
  log.info('Addiitional installation steps complete!')
}
