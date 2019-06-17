const { Command } = require('commander')
const log = require('../../lib/log')

const program = new Command('pre')

program
  .command('clone [propertyId]')
  .description('clone the remote draft pre script for a property into a new subdirectory')
  .action(cmd('clone'))

program
  .command('pull [propertyId] [live/draft]')
  .description('pull the remote live/draft (defaults to draft) pre script for a property into your current directory')
  .action(cmd('pull'))

program
  .command('push')
  .description('push your local pre script for a property to the remote draft')
  .option('--force', 'force push local changes even though there have been remote changes')
  .action(cmd('push'))

program
  .command('revisions [propertyId]')
  .description('list the published revisions of a property\'s pre script')
  .action(cmd('revisions'))

program
  .command('diff [live/draft]')
  .description('diff your local pre script against the remote live/draft')
  .action(cmd('diff'))

program
  .command('publish')
  .description('publish the remote draft pre script to live')
  .option('--force', 'force publish the remote draft even though your local draft is out of sync')
  .action(cmd('publish'))

const argv = process.argv.filter(arg => arg !== 'pre')

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
