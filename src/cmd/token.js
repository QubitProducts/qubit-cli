const chalk = require('chalk')
const log = require('../lib/log')
const getToken = require('../server/lib/token')

module.exports = async function tokenCmd () {
  const token = await getToken(
    'refresh_token',
    'openid profile offline_access',
    'Token generated! See terminal for more info.'
  )
  log.info('Your token:')
  log.info(chalk.green(token))
  log.info(`Please keep this token secure.`)
  log.info(`It can be revoked at any point using 'qubit revoke {token}' command.`)
}
