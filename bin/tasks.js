#!/usr/bin/env node
const program = require('commander')
const {
  installQubitDeps,
  createInstallPrivatePackages,
  syncVersions
} = require('../src/lib/install-qubit-deps')

program
  .command('installQubitDeps')
  .description('Install private packages')
  .option('-d, --dev', 'install dev deps')
  .option('-l, --login', 'login')
  .action(program => {
    const { dev, login } = program.opts()
    return installQubitDeps(login || false, dev)
  })

program
  .command('createInstallPrivatePackages')
  .description('Create private npm shrinkwrap')
  .action(createInstallPrivatePackages)

program
  .command('syncVersions')
  .option('-c, --commit', 'commit changes')
  .description('Sync private package & npm shrinkwrap versions')
  .action(program => syncVersions(program.opts().commit))

program.parse(process.argv)
