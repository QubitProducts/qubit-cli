const path = require('path')
const execa = require('execa')
const log = require('./log')
const fs = require('fs-extra')
const { getRegistryToken } = require('./get-delegate-token')
const { ROOT, PRIVATE_DEPS } = require('../constants')

module.exports = {
  installQubitDeps,
  installPrivatePackages,
  createInstallPrivatePackages,
  syncVersions
}

async function installQubitDeps (login = true, devDeps = false) {
  if (!hasDeps(devDeps)) {
    log.info(
      'Qubit-CLI needs to complete its installation, this may take a minute'
    )
    if (login) {
      await getRegistryToken()
    }
    log.info('Installing additional dependencies...')
    await backupPkgJSON('public')
    await installPkgJSON('private')
    await exec(`npm install --ignore-scripts${devDeps ? ' --dev' : ''}`, true)
    await installPkgJSON('public')
    await rmPkgJSON('public')
    log.info('Additional installation steps complete!')
    return true
  }
}

function hasDeps (devDeps) {
  const deps = devDeps ? ['standard'].concat(PRIVATE_DEPS) : PRIVATE_DEPS
  const missing = deps
    .filter(name => !['@qubit/jolt', '@qubit/placement-engine'].includes(name))
    .map(name => {
      try {
        require(name)
        return null
      } catch (err) {
        return err
      }
    })
    .filter(err => err && err.code === 'MODULE_NOT_FOUND')
  return !missing.length
}

async function createInstallPrivatePackages () {
  const logging = true
  await uninstallPrivatePackages(logging)
  await backupPkgJSON('public', logging)
  await installPrivatePackages(logging)
  await backupPkgJSON('private', logging)
  await installPkgJSON('public', logging)
  await rmPkgJSON('public', logging)
}

async function syncVersions (commit = false) {
  const { version } = require('../../package.json')
  const privatePkg = require('../../private-package.json')
  const privatePkgLock = require('../../private-npm-shrinkwrap.json')
  await writeJson(
    'private-package.json',
    Object.assign({}, privatePkg, { version })
  )
  await writeJson(
    'private-npm-shrinkwrap.json',
    Object.assign({}, privatePkgLock, { version })
  )

  const changed =
    version !== privatePkg.version || version !== privatePkgLock.version
  if (changed && commit) {
    await exec('git add private*', true)
    await exec('git commit --amend --no-edit', true)
  }
}

async function installPrivatePackages (logging) {
  await exec(
    `npm install --ignore-scripts --dev${' ' + PRIVATE_DEPS.join(' ')}`,
    logging
  )
}

async function uninstallPrivatePackages (logging) {
  return exec(`npm uninstall ${PRIVATE_DEPS.join(' ')}`, logging)
}

async function backupPkgJSON (name, logging) {
  return Promise.all(
    [
      `cp package.json ${name}-package.json`,
      `cp npm-shrinkwrap.json ${name}-npm-shrinkwrap.json`
    ].map(command => exec(command, logging))
  )
}

async function installPkgJSON (name, logging) {
  return Promise.all(
    [
      `cp ${name}-package.json package.json`,
      `cp ${name}-npm-shrinkwrap.json npm-shrinkwrap.json`
    ].map(command => exec(command, logging))
  )
}

async function rmPkgJSON (name, logging) {
  return Promise.all(
    [`rm -f ${name}-package.json `, `rm -f ${name}-npm-shrinkwrap.json`].map(
      command => exec(command, logging)
    )
  )
}

function exec (command, logging) {
  const [cmd1, ...cmd2] = command.split(' ')
  const opts = {
    cwd: path.resolve(ROOT)
  }

  if (logging) {
    console.log(command)
    opts.stdio = 'inherit'
  } else {
    opts.stderr = 'inherit'
  }
  return execa(cmd1, cmd2, opts)
}

function writeJson (location, data) {
  return fs.writeFile(
    path.join(ROOT, location),
    JSON.stringify(data, null, 2) + '\n'
  )
}
