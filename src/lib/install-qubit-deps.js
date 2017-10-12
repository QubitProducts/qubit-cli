const path = require('path')
const execa = require('execa')
const { getRegistryToken } = require('./get-token')
const login = require('../server/lib/login')
const log = require('./log')

module.exports = async function installQubitDeps () {
  log.info(`Setting up Qubit-CLI, this may take a few mins`)
  await getRegistryToken(() => login())
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
