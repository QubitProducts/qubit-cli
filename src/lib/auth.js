const os = require('os')
const fs = require('fs-promise')
let xprcPath = `${os.homedir()}/.xprc`

function get (domain) {
  return getAll().then((data) => {
    return data[domain] || {}
  })
}

function getAll () {
  return fs.readFile(xprcPath)
    .catch(() => '{}')
    .then(String)
    .then(JSON.parse)
}

function set (domain, authType, token) {
  return getAll().then((data) => {
    data[domain] = data[domain] || {}
    data[domain][authType] = token
    return fs.writeFile(xprcPath, JSON.stringify(data))
  })
}

module.exports = { get, set }
