const config = require('config')
const os = require('os')
const fs = require('fs-promise')
let xprcPath = `${os.homedir()}/.xprc`

function get () {
  return getAll().then((data) => {
    return data[config.endpoint] || {}
  })
}

function getAll () {
  return fs.readFile(xprcPath)
    .catch(() => '{}')
    .then(String)
    .then(JSON.parse)
}

function set (authType, token) {
  return getAll().then((data) => {
    data[config.endpoint] = data[config.endpoint] || {}
    data[config.endpoint][authType] = token
    return fs.writeFile(xprcPath, JSON.stringify(data))
  })
}

module.exports = { get, set }
