const path = require('path')
const execa = require('execa')
const log = require('./log')
const { getRegistryToken } = require('./get-delegate-token')
const dependencies = [
  '@qubit/buble',
  '@qubit/buble-loader',
  '@qubit/experience-defaults',
  '@qubit/jolt',
  '@qubit/poller',
  '@qubit/uv-api',
  '@qubit/http-api',
  '@qubit/placement-engine'
]

module.exports = async function installQubitDeps (login = true) {
  if (!hasDeps()) {
    log.info(
      'Qubit-CLI needs to complete its installation, this may take a minute'
    )
    if (login) {
      await getRegistryToken()
    }
    log.info('Installing additional dependencies...')
    await execa('make', ['install-private-packages'], {
      cwd: path.resolve(__dirname, '../../'),
      stdio: 'inherit'
    })
    log.info('Additional installation steps complete!')
    return true
  }
}

function hasDeps () {
  const missing = dependencies
    .filter(name => !['@qubit/jolt', '@qubit/placement-engine'].includes(name))
    .map(name => {
      try {
        require(name)
        return null
      } catch (err) {
        return err
      }
    })
    .filter(err => err && err.code === 'MODULE_NOT_FOUND')
  return !missing.length
}
