const config = require('../../config')
const fs = require('fs-extra')
let { QUBITRC } = require('./constants')

async function get () {
  const data = await getAll()
  return data[config.services.app] || {}
}

async function getAll () {
  console.log(QUBITRC)
  let all = String(await fs.readFile(QUBITRC).catch(() => '{}'))
  console.log(all)
  return JSON.parse(all)
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
