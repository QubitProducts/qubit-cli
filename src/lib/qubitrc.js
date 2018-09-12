const _ = require('lodash')
const yaml = require('js-yaml')
const fs = require('fs-extra')
const execa = require('execa')
const config = require('../../config')
const log = require('./log')
let { QUBITRC, REGISTRY_TOKEN, REGISTRY_SCOPES } = require('../constants')
let inMemory = false
let data

async function read () {
  try {
    if (!inMemory) {
      data = parse(String(await fs.readFile(QUBITRC)))
      inMemory = true
    }
    return data
  } catch (err) {
    return {}
  }
}

async function write (newData) {
  newData = newData || {}
  newData.ENV = getEnv()
  let output = newData
  data = newData
  return fs.writeFile(QUBITRC, serialize(output))
}

function get (key) {
  return read()
    .then(result => result[getEnv()] || {})
    .then(result => result[key])
}

async function set (key, value) {
  return read().then(currentData => {
    let env = getEnv()
    log.debug(`setting ${env}:${key} to ${value}`)
    currentData[env] = currentData[env] || {}
    Object.assign(currentData[env], { [key]: value })
    return write(currentData)
  })
}

async function unset (key) {
  return read().then(currentData => {
    let env = getEnv()
    currentData[env] = currentData[env] || {}
    delete currentData[env][key]
    return write(currentData)
  })
}

async function unsetEnv () {
  return read().then(currentData => {
    let env = getEnv()
    delete currentData[env]
    return write(currentData)
  })
}

function getEnv () {
  // note: this isn't wrong. the default environment for Qubit-CLI is production
  return process.env.NODE_ENV || 'production'
}

function parse (value) {
  return _.pick(value ? yaml.load(value) : {}, ['debug', 'development', 'staging', 'production', 'test', 'ENV'])
}

function serialize (things) {
  return yaml.dump(things)
}

async function switched () {
  let prevENV = (await read()).ENV
  let currentENV = getEnv()
  return prevENV !== currentENV
}

async function setNPMRC (registryToken, scopes) {
  log.debug('Setting up npmrc')
  let commands = []
  const authKey = config.services.registry.replace(/^https?:/, '')
  // always ensure that @qubit and @qutics scopes are configured
  commands.push(`npm config set ${authKey}/:_authToken ${registryToken}`)
  for (let scope of scopes) commands.push(`npm config set ${scope}:registry ${config.services.registry}/`)
  return execa.shell(commands.join(' && '))
}

async function unsetNPMRC () {
  let scopes = await get(REGISTRY_SCOPES)
  log.debug('Unsetting npmrc')
  let commands = []
  const authKey = config.services.registry.replace(/^https?:/, '')
  // always ensure that @qubit and @qutics scopes are configured
  commands.push(`npm config delete ${authKey}/:_authToken`)
  log.debug(`Scopes: ${scopes && scopes.join(', ')}`)
  if (scopes) {
    for (let scope of scopes) commands.push(`npm config delete ${scope}:registry ${config.services.registry}/`)
  }
  return execa.shell(commands.join(' && '))
}

async function login (registryToken, scopes) {
  await set(REGISTRY_TOKEN, registryToken)
  await set(REGISTRY_SCOPES, scopes)
  await setNPMRC(registryToken, scopes)
}

async function logout () {
  await unsetNPMRC()
  await unsetEnv()
}

module.exports = { get, set, unset, unsetEnv, switched, setNPMRC, unsetNPMRC, login, logout }
