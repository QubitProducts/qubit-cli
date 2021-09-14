#!/usr/bin/env node
const pkg = require('../package.json')
require('../src/lib/version-check')(pkg)

const getUpdate = require('../src/lib/get-update')
const run = require('../src/cmd')

getUpdate()

run(pkg)
