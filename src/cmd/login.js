const qubitrc = require('../lib/qubitrc')
const getToken = require('../server/lib/token')
const { getRegistryToken } = require('../lib/get-delegate-token')
const { ID_TOKEN } = require('../constants')
const log = require('../lib/log')

module.exports = async function loginCmd (id) {
  await qubitrc.logout()
  const token = await getToken(
    'id_token',
    'openid profile',
    'You are logged in and can now close this tab!'
  )
  await qubitrc.set(ID_TOKEN, token)
  await getRegistryToken(true)
  log.info('Login successful!')
}
