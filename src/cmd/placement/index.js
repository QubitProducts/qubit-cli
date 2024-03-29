const { Command } = require('commander')
const log = require('../../lib/log')

const program = new Command('placement')

program
  .command('create [propertyId] [tagId] [personalisationType] [name]')
  .description('create a new placement')
  .action(cmd('create'))

program
  .command('clone [propertyId] [placementId] [active/draft]')
  .description('clone a placement into a new directory')
  .action(cmd('clone'))

program
  .command('pull [propertyId] [placementId] [active/draft]')
  .description('pull the remote changes (defaults to draft)')
  .action(cmd('pull'))

program
  .command('push')
  .description('push your local changes')
  .option(
    '--force',
    'force push local changes even though there have been remote changes'
  )
  .action(cmd('push'))

program
  .command('publish')
  .description('publish your changes')
  .option(
    '--force',
    'force publish the remote draft even though your local draft is out of sync'
  )
  .action(cmd('publish'))

program
  .command('unpublish')
  .description('unpublish your changes')
  .option(
    '--force',
    'force publish the remote draft even though your local draft is out of sync'
  )
  .action(cmd('unpublish'))

program
  .command('diff [active/draft]')
  .description('diff your local placement against the remote active/draft')
  .action(cmd('diff'))

program
  .command('open')
  .description('open the placement editor in your browser')
  .action(cmd('open'))

const argv = process.argv.filter(arg => arg !== 'placement')

module.exports = {
  action: () => program.parse(argv),
  outputHelp: () => program.outputHelp()
}

function cmd (command) {
  return (...args) => {
    log.trace(`running ${command}`)
    return require('./' + command)(...args).catch(err => log.error(err))
  }
}
