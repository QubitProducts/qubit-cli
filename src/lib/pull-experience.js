const chalk = require('chalk')
const down = require('../services/down')
const scaffold = require('./scaffold')
const log = require('./log')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')

module.exports = async function pullExperience (CWD, propertyId, experienceId) {
  log(chalk.yellow('Pulling experience'))
  const { files } = await down(experienceId)
  const pkg = await getPkg()
  if (pkg.meta) files['package.json'] = JSON.stringify(mergePkg(pkg, files['package.json']), null, 2)
  await scaffold(CWD, files, false, true)
  log(chalk.green(`Experience pulled into current working directory`))
}
