const os = require('os')
const fs = require('fs-promise')

function get (domain) {
  return fs.readFile(xprcPath()).then(JSON.parse, () => {})
    .then((data) => ((data || {})[domain]) || {})
}

function set (domain, authType, token) {
  return get(domain).then((data) => {
    data = data || {}
    data[domain] = data[domain] || {}
    data[domain][authType] = decodeURIComponent(token)
    return fs.writeFile(xprcPath(), JSON.stringify(data))
  })
}

function xprcPath () {
  return `${os.homedir()}/.xprc`
}

module.exports = { get, set }
