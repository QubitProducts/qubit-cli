const _ = require('lodash')
const yaml = require('js-yaml')
const fs = require('fs-extra')
let { QUBITRC } = require('./constants')

async function read () {
  try {
    let data = String(await fs.readFile(QUBITRC))
    return parse(data)
  } catch (err) {
    return {}
  }
}

async function write (data) {
  let output = serialize(data)
  return fs.writeFile(QUBITRC, output)
}

function get (key) {
  return read()
    .then(result => result[getEnv()] || {})
    .then(result => result[key])
}

async function set (key, value) {
  return read()
    .then(data => {
      let env = getEnv()
      data[env] = data[env] || {}
      Object.assign(data[env], { [key]: value })
      return write(data)
    })
}

async function unset (key) {
  return read()
    .then(data => {
      let env = getEnv()
      data[env] = data[env] || {}
      delete data[env][key]
      return write(data)
    })
}

async function unsetEnv () {
  return read()
    .then(data => {
      let env = getEnv()
      delete data[env]
      return write(data)
    })
}

function getEnv () {
  // note: this isn't wrong. the default environment for Qubit-CLI is production
  return process.env.NODE_ENV || 'production'
}

function parse (value) {
  return _.pick(value ? yaml.load(value) : {}, ['debug', 'staging', 'production', 'test'])
}

function serialize (data) {
  return yaml.dump(data)
}

module.exports = { get, set, unset, unsetEnv }
