const program = require('commander')
const chalk = require('chalk')
const log = require('../lib/log')
const create = require('./create')
const extension = require('./extension')
const login = require('./login')
const open = require('./open')
const previewLink = require('./preview-link')
const pull = require('./pull')
const push = require('./push')
const serve = require('./serve')
const templatize = require('./templatize')

module.exports = function run (pkg) {
  program
    .command('create <propertyId>')
    .description('create an experience')
    .action(create)

  program
    .command('pull')
    .description(`pull into local experience from platform or template`)
    .action(pull)

  program
    .command('push')
    .description('push experience up to remote')
    .action(push)

  program
    .command('templatize')
    .description('create a template from an experience')
    .action(templatize)

  program
    .command('preview-link')
    .description('log sharable cross-browser preview links for your variations')
    .action(previewLink, log.error)

  program
    .command('open')
    .description('open the overview page for your local experience')
    .action(open)

  program
    .command('extension')
    .description('open folder containing chrome extension, drag into chrome to install')
    .action(extension)

  program
    .usage(`[options] <cmd>`)
    .version(pkg.version)
    .arguments('[variation]')
    .option('-w, --watch', 'watch for changes and live reload')
    .option('-s, --sync', 'watch for changes, live reload and also sync with remote on every change')
    .option('-v, --verbose', 'log verbose output', false)
    .action(serve)

  program
    .command('login')
    .description('login to the qubit platform')
    .action(login)

  program.on('--help', function () {
    console.log(`  Tutorial:

      To install the extension:
      $ ${chalk.green.bold('xp extension')}
      then drag the chrome-extension folder into chrome

      To quickly hack on something with no side effects:
      $ ${chalk.green.bold('xp pull example')}
      $ ${chalk.green.bold('xp --watch')}
      Now open chrome and turn on xp by clicking on the extension icon
      you should see the background of the page turn ${chalk.yellow.bold('yellow')}!

      To pull down an existing experience:
      - ${chalk.green.bold('xp pull <propertyId> <experienceId>')} if you know the propertyId and experienceId
      - ${chalk.green.bold('xp pull https://app.qubit.com/p/{propertyId}/experiences/{experienceId}')} if you know the url
      - Otherwise, type ${chalk.green.bold('xp pull')} then navigate to your experience and xp will guide you from there

      To create a new experience in the platform:
      $ ${chalk.green.bold('xp create <propertyId>')}
      note: propertyId is the number after /p/ in our urls

      To save your changes to the platform:
      $ ${chalk.green.bold('xp push')}

      To generate a template from a local experience:
      $ ${chalk.green.bold('xp templatize')}

      To pull an existing template into a local experience:
      $ ${chalk.green.bold('xp pull <templateName>')}

      To enable hot reloading:
      Implement a remove function in your variation file like so:

      function execution (options) {
        console.log('executing variation')
        return {
          remove: function remove () {
            // undo any changes e.g. $modal.remove()
          }
        }
      }`)
  })

  program.parse(process.argv)

  if (!program.args.length) serve(null, program)
}
