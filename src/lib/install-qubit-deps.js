const _ = require('lodash')
const path = require('path')
const execa = require('execa')
const log = require('./log')
const { getRegistryToken } = require('./get-delegate-token')
const dependencies = {
  '@qubit/buble': '^0.19.10',
  '@qubit/buble-loader': '^0.5.1',
  '@qubit/experience-defaults': '^1.2.4',
  '@qubit/jolt': '^7.33.0',
  '@qubit/poller': '^2.0.1',
  '@qubit/uv-api': '*',
  '@qubit/http-api': '^1.6.1',
  '@qubit/placement-engine': '^1.9.0'
}

module.exports = async function installQubitDeps () {
  try {
    require('@qubit/buble-loader')
  } catch (err) {
    log.info('Setting up Qubit-CLI, this may take a few mins')
    await getRegistryToken()
    log.info('Installing some additional dependencies...')
    await execa(
      'npm',
      ['install', '--no-save'].concat(
        _.map(dependencies, (version, name) => `${name}@${version}`)
      ),
      {
        cwd: path.resolve(__dirname, '../../'),
        stdio: 'inherit'
      }
    )
    log.info('Additional installation steps complete!')
  }
}
