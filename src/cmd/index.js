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
const del = require('./del')
const serve = require('./serve')
const login = require('./login')
const logout = require('./logout')
const templatize = require('./templatize')
const traffic = require('./traffic')
const goals = require('./goals')
const action = require('./action')
const diff = require('./diff')
const duplicate = require('./duplicate')
const release = require('./release')

module.exports = function run (pkg) {
  program
    .command('login')
    .description('login to the qubit platform')
    .action(function runLogin (options) {
      if (/^(development|staging|production)$/.test(options)) {
        log.warn(`qubit release no longer accepts an environment option`)
        this.outputHelp(chalk.red)
        return
      }
      return login()
    })

  program
    .command('logout')
    .description('logout of the qubit platform')
    .action(logout)

  program
    .command('release')
    .arguments('[version]')
    .usage(`

  xp release <version>

  Examples:

  $ xp release
  $ xp release patch
  $ xp release 1.0.2
  $ xp release 1.0.2-beta.3 --tag=beta`)
    .description('release a new version of your package')
    .option('--any-branch', 'allow publishing from any branch', false)
    .option('--no-cleanup', 'Skips cleanup of node_modules', false)
    .option('--yolo', 'Skips cleanup and testing', false)
    .option('--no-publish', 'Skips publishing', false)
    .option('--tag', 'Publish under a given dist-tag', false)
    .option('--no-yarn', `Don't use Yarn`, false)
    .action(function runRelease (version, options) {
      if (/^(development|staging|production)$/.test(version)) {
        log.warn(`qubit release no longer accepts an environment option`)
        this.outputHelp(chalk.red)
        return
      }
      return release(version, options)
    })

  program
    .command('create [propertyId]')
    .usage(chalk.gray(`
    Create using propertyId:
    qubit create 1010

    Create using autocomplete or by navigating to your experience in the browser:
    qubit clone`))
    .description('create an experience (arguments optional)')
    .action(create)

  program
    .command('clone [url] [propertyId] [experienceId]')
    .usage(chalk.gray(`

    Clone from url:
    qubit clone http://app.qubit.com/p/1010/experiences/10101/editor

    Clone using propertyId and experienceId:
    qubit clone 1010 10101

    Clone using autocomplete or by navigating to your experience in the browser:
    qubit clone`))
    .description(`clone an experience (arguments optional)`)
    .action(clone)

  program
    .command('publish')
    .description('publish an experience')
    .action(action)

  program
    .command('pause')
    .description('pause an experience')
    .action(action)

  program
    .command('resume')
    .description('resume an experience')
    .action(action)

  program
    .command('templatize')
    .description('create a template from an experience')
    .action(templatize)

  program
    .command('pull [name]')
    .description(`pull remote changes or a template into your local experience (arguments optional)`)
    .action(pull)

  program
    .command('push')
    .option('--force', 'force push local changes even though there have been remote changes')
    .description('push local changes to the platform')
    .action(push)

  program
    .command('duplicate')
    .description('create a new variation within your experience')
    .action(duplicate)

  program
    .command('traffic')
    .option('--view', 'view the current control size')
    .description('set the control size of an experience')
    .action(traffic)

  program
    .command('goals [cmd]')
    .usage(chalk.grey(`

  List goals:
  qubit goals list

  Add a goal:
  qubit goals add

  Remove a goal:
  qubit goals remove

  Change the primary goal of your experience:
  qubit goals set-primary`))
    .description('list or edit experience goals')
    .action(goals)

  program
    .command('diff')
    .description('compare local and remote versions of an experience')
    .action(diff)

  program
    .command('delete')
    .description('delete and experience or variation')
    .action(del)

  program
    .command('status')
    .description('check the publish status of an experience')
    .action(action)

  program
    .command('open')
    .arguments('[page]')
    .description('open the overview, settings or editor page for the current experience')
    .action(open)

  program
    .command('link')
    .arguments('[page]')
    .description('get a link to the overview, settings, editor or preview page for the current experience')
    .action(link)

  program
    .command('extension')
    .description('open folder containing the Qubit-CLI chrome extension, drag into chrome extensions pane to install')
    .action(extension)

  program
    .usage(`[options] <cmd>`)
    .version(pkg.version)
    .arguments('[variationFilename]')
    .option('-v, --verbose', 'log verbose output', false)
    .action(serve)

  program.on('--help', function () {
    console.log(`
    For more info visit https://github.com/qubitdigital/xp-cli/blob/master/README.md`)
  })

  program.parse(process.argv)

  if (!program.args.length) serve(null, program)
}
