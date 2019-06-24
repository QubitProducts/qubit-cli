const _ = require('lodash')
const getPkg = require('./get-pkg')

module.exports = { experience, pre }

async function experience (suggestedCommand) {
  const pkg = await getPkg()
  if (_.get(pkg, 'meta.experienceId')) {
    let message = 'Cannot run this command in an experience directory'
    if (suggestedCommand) {
      message += `. You probably meant to use \`${suggestedCommand}\``
    }
    throw new Error(message)
  }
}

async function pre (suggestedCommand) {
  const pkg = await getPkg()
  if (_.get(pkg, 'meta.isPreScript')) {
    var message = 'Cannot run this command in a pre script directory'
    if (suggestedCommand) {
      message += `. You probably meant to use \`${suggestedCommand}\``
    }
    throw new Error(message)
  }
}
