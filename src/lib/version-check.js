var semverbs = require('semverbs')
var chalk = require('chalk')

module.exports = function versionCheck (pkg) {
  if (semverbs.lt(process.version, pkg.engines.node)) {
    console.log(`
      ${chalk.bold.red(`ERROR:`)} Qubit-CLI requires a node version ${chalk.bold.green(pkg.engines.node)}

      You are running node ${chalk.bold.red(process.version)}

      Please upgrade your version of node in order to use this package
    `)
    process.exit(1)
  }
}
