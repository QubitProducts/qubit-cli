#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const privatePkg = require('../private-package.json')
const privatePkgLock = require('../private-package-lock.json')
const pkg = require('../package.json')
const writeJson = (location, data) =>
  fs.writeFile(path.join(__dirname, location), JSON.stringify(data, null, 2))

async function syncVersions () {
  privatePkg.version = pkg.version
  privatePkgLock.version = pkg.version

  await writeJson('../private-package.json', privatePkg)
  await writeJson('../private-package-lock.json', privatePkgLock)
}

syncVersions()
