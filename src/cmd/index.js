const program = require('commander')
const chalk = require('chalk')
const log = require('../lib/log')
const create = require('./create')
const extension = require('./extension')
const open = require('./open')
const link = require('./link')
const clone = require('./clone')
const pull = require('./pull')
const push = require('./push')
const serve = require('./serve')
const login = require('./login')
const templatize = require('./templatize')
const traffic = require('./traffic')
const goals = require('./goals')
const diff = require('./diff')
const duplicate = require('./duplicate')

module.exports = function run (pkg) {
  program
    .command('create <propertyId>')
    .description('create an experience')
    .action(create)

  program
    .command('duplicate')
    .description('duplicate a variation')
    .action(duplicate)

  program
    .command('clone')
    .description(`clone a remote experience from platform`)
    .action(clone)

  program
    .command('pull')
    .description(`pull remote changes or template into local experience`)
    .action(pull)

  program
    .command('push')
    .option('--force', 'force push changes even though the remote is different')
    .description('push experience up to remote')
    .action(push)

  program
    .command('templatize')
    .description('create a template from an experience')
    .action(templatize)

  program
    .command('diff')
    .description('compare local and remote versions of an experience')
    .action(diff)

  program
    .command('traffic')
    .option('--view', 'view the current control size')
    .description('set the control size of an experience')
    .action(traffic)

  program
    .command('goals <cmd>')
    .description('`list`, `add`, `remove` and `set-primary` being arguments')
    .action(goals)

  program
    .command('open')
    .option('--overview', 'open the overview page on app.qubit.com for your local experience')
    .option('--settings', 'open the settings page on app.qubit.com for your local experience')
    .option('--editor', 'open the editor page on app.qubit.com for your local experience')
    .description('open the overview page on app.qubit.com for your local experience')
    .action(open)

  program
    .command('link')
    .option('--overview', 'logs and copies the overview link for app.qubit.com')
    .option('--settings', 'logs and copies the settings link for app.qubit.com')
    .option('--editor', 'logs and copies the editor link for app.qubit.com')
    .option('--preview', 'logs and copies the preview link(s)')
    .description('log and copy shareable links for your experience')
    .action(link, log.error)

  program
    .command('extension')
    .description('open folder containing chrome extension, drag into chrome extensions pane to install')
    .action(extension)

  program
    .command('login')
    .description('login to the qubit platform')
    .action(login)

  program
    .usage(`[options] <cmd>`)
    .version(pkg.version)
    .arguments('[variation]')
    .option('-w, --watch', 'watch for changes and live reload')
    .option('-s, --sync', 'watch for changes, live reload and also sync with remote on every change')
    .option('-v, --verbose', 'log verbose output', false)
    .action(serve)

  program.on('--help', function () {
    console.log(`  Tutorial:

    To install the extension:
    $ ${chalk.green.bold('xp extension')}
    then drag the chrome-extension folder into the chrome extensions pane

    Previewing with local server:
    $ ${chalk.green.bold('xp pull example')}
    $ ${chalk.green.bold('xp --watch')}
    Now open chrome and turn on xp by clicking on the extension icon
    you should see the background of the page turn ${chalk.yellow.bold('yellow')}!
    Change the css in varaition.css, and the preview should update on the fly!

    To clone an existing experience:
    - ${chalk.green.bold('xp clone <propertyId> <experienceId>')} if you know the propertyId and experienceId
    - ${chalk.green.bold('xp clone https://app.qubit.com/p/{propertyId}/experiences/{experienceId}')} if you know the url
    - Otherwise, type ${chalk.green.bold('xp clone')} then navigate to your experience and xp will guide you from there

    To create a new experience:
    $ ${chalk.green.bold('xp create <propertyId>')}
    note: propertyId is the number after /p/ in our urls

    To push your changes up to the platform
    $ ${chalk.green.bold('xp push')}

    To pull remote changes from the platform:
    $ ${chalk.green.bold('xp pull')}

    To generate a template from your local experience files:
    $ ${chalk.green.bold('xp templatize')}

    To scaffold an experience from a template:
    $ ${chalk.green.bold('xp pull <templateName>')}

    To make an xp template available for sharing:
    publish to npm or git
    consumers can then simply install like so:

    $ ${chalk.green.bold('npm install -g xp-tmp-example')}
    $ ${chalk.green.bold('npm install -g github:user/xp-tmp-example')}
    $ ${chalk.green.bold('npm install -g github:user/xp-multi-template-repo/example')}

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
