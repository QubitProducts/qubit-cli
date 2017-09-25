const config = require('../../config')
const fs = require('fs-extra')
let { QUBITRC } = require('./constants')

async function get () {
  const data = await getAll()
  return data[config.services.app] || {}
}

function getAll () {
  return fs.readFile(QUBITRC)
    .then(all => JSON.parse(String(all)))
    .catch(e => ({}))
}

async function set (authType, token) {
  const data = await getAll()
  data[config.services.app] = data[config.services.app] || {}
  data[config.services.app][authType] = token
  return fs.writeFile(QUBITRC, JSON.stringify(data))
}

async function rm (authType) {
  const data = await getAll()
  data[config.services.app] = data[config.services.app] || {}
  delete data[config.services.app][authType]
  return fs.writeFile(QUBITRC, JSON.stringify(data))
}

module.exports = { get, set, rm }
