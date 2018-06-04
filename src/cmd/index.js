const program = require('commander')
const chalk = require('chalk')
const hasYarn = require('has-yarn')
const log = require('../lib/log')
const installQubitDeps = require('../lib/install-qubit-deps')

module.exports = async function run (pkg) {
  await installQubitDeps()
  program
    .command('login')
    .description('login to the qubit platform')
    .action(function runLogin (options) {
      if (/^(development|staging|production)$/.test(options)) {
        log.warn(`qubit release no longer accepts an environment option`)
        this.outputHelp(chalk.red)
        return
      }
      return require('./login')()
    })

  program
    .command('logout')
    .description('logout of the qubit platform')
    .action(cmd('logout'))

  program
    .command('scopes')
    .description('show what scopes you have access to')
    .action(cmd('scopes'))

  program
    .command('release')
    .arguments('[version]')
    .usage(`

  qubit release <version>

  Examples:

  $ qubit release
  $ qubit release patch
  $ qubit release 1.0.2
  $ qubit release 1.0.2-beta.3 --tag=beta`)
    .description('release a new version of your package')
    .option('--any-branch', 'allow publishing from any branch')
    .option('--no-cleanup', 'Skips cleanup of node_modules')
    .option('--yolo', 'Skips cleanup and testing')
    .option('--no-publish', 'Skips publishing')
    .option('--tag', 'Publish under a given dist-tag')
    .option('--no-yarn', `Don't use Yarn`)
    .action(function runRelease (version, options) {
      if (/^(development|staging|production)$/.test(version)) {
        log.warn(`qubit release no longer accepts an environment option`)
        this.outputHelp(chalk.red)
        return
      }
      // Defer to np's defaults
      if (options.cleanup) delete options.cleanup
      if (options.publish) delete options.publish
      // options.yarn must be a boolean, if it's true
      // use the same yarn detection as np does in cli.js
      if (options.yarn === true) {
        options.yarn = hasYarn()
      }
      return require('./release')(version, options)
    })

  program
    .command('create [propertyId]')
    .usage(chalk.gray(`
    Create using propertyId:
    qubit create 1010

    Create using autocomplete or by navigating to your experience in the browser:
    qubit clone`))
    .description('create an experience (arguments optional)')
    .action(cmd('create'))

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
    .action(cmd('clone'))

  program
    .command('clone-all [propertyId]')
    .description(`clone all experiences from a given property`)
    .action(cmd('clone-all'))

  program
    .command('pull-all')
    .description(`pull remote changes for all experience folders in the current directory`)
    .action(cmd('pull-all'))

  program
    .command('publish')
    .description('publish an experience')
    .action(cmd('action'))

  program
    .command('pause')
    .description('pause an experience')
    .action(cmd('action'))

  program
    .command('resume')
    .description('resume an experience')
    .action(cmd('action'))

  program
    .command('templatize')
    .description('create a template from an experience')
    .action(cmd('templatize'))

  program
    .command('pull [name]')
    .description(`pull remote changes or a template into your local experience (arguments optional)`)
    .action(cmd('pull'))

  program
    .command('push')
    .option('--force', 'force push local changes even though there have been remote changes')
    .description('push local changes to the platform')
    .action(cmd('push'))

  program
    .command('duplicate-experience [destinationPropertyId] [experienceId]')
    .description('Duplicate an experience')
    .action(cmd('duplicate-experience'))

  program
    .command('duplicate-variation')
    .description('from an experience folder, duplicate the last variation')
    .action(cmd('duplicate-variation'))

  program
    .command('traffic')
    .option('--view', 'view the current control size')
    .description('set the control size of an experience')
    .action(cmd('traffic'))

  program
    .command('goals <cmd>')
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
    .action(cmd('goals'))

  program
    .command('diff')
    .description('compare local and remote versions of an experience')
    .action(cmd('diff'))

  program
    .command('delete')
    .description('delete and experience or variation')
    .action(cmd('del'))

  program
    .command('upload')
    .arguments('[files...]')
    .description('upload images to the qubit cdn')
    .action(cmd('upload'))

  program
    .command('status')
    .description('check the publish status of an experience')
    .action(cmd('action'))

  program
    .command('open')
    .arguments('[page]')
    .description(`shortcut to open the 'overview', 'settings' or 'editor' page for the current experience`)
    .action(cmd('open'))

  program
    .command('link')
    .arguments('[page]')
    .description(`shortcut to get a link to the 'overview', 'settings', 'editor' or 'preview' page for the current experience`)
    .action(cmd('link'))

  program
    .command('extension')
    .description('open folder containing the Qubit-CLI chrome extension, drag into chrome extensions pane to install')
    .action(cmd('extension'))

  program
    .usage(`[options] <cmd>`)
    .version(pkg.version)
    .arguments('[variationFilename]')
    .option('-v, --verbose', 'log verbose output', false)
    .action((variationFileName, opts) => {
      if (!variationFileName.includes('variation')) return log.error(`${variationFileName} command does not exist`)
      return require('./serve')(variationFileName, opts)
    })

  program.on('--help', function () {
    console.log(`
    For more info visit https://docs.qubit.com/content/developers/cli-overview`)
  })

  program.parse(process.argv)

  if (!program.args.length) require('./serve')(null, program)
}

function cmd (command) {
  return (...args) => require('./' + command)(...args)
}
