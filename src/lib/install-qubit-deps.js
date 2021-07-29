const path = require('path')
const execa = require('execa')
const log = require('./log')
const { getRegistryToken } = require('./get-delegate-token')

module.exports = async function installQubitDeps () {
  try {
    const deps = require('qubit-cli-deps')
    if (!deps.hasQubitDeps) throw new Error('oh noes!')
  } catch (err) {
    log.info('Setting up Qubit-CLI, this may take a few mins')
    await getRegistryToken()
    log.info('Installing some additional dependencies...')
    await execa('npm', ['install', './deps', '--no-save'], {
      cwd: path.resolve(__dirname, '../../'),
      stdio: 'inherit'
    })
    log.info('Additional installation steps complete!')
  }
}
