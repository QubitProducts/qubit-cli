const config = require('../../config')
const os = require('os')
const fs = require('fs-promise')
let xprcPath = `${os.homedir()}/.xprc`

async function get () {
  const data = await getAll()
  return data[config.services.app] || {}
}

async function getAll () {
  return JSON.parse(String(await fs.readFile(xprcPath).catch(() => '{}')))
}

async function set (authType, token) {
  const data = await getAll()
  data[config.services.app] = data[config.services.app] || {}
  data[config.services.app][authType] = token
  return fs.writeFile(xprcPath, JSON.stringify(data))
}

async function rm (authType) {
  const data = await getAll()
  data[config.services.app] = data[config.services.app] || {}
  delete data[config.services.app][authType]
  return fs.writeFile(xprcPath, JSON.stringify(data))
}

module.exports = { get, set, rm }
