#!/usr/bin/env node
const program = require('commander')
const {
  installPrivatePackages,
  createInstallPrivatePackages,
  syncVersions
} = require('../src/lib/install-qubit-deps')

program
  .command('installPrivatePackages')
  .description('Create private npm shrinkwrap')
  .action(installPrivatePackages)

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
