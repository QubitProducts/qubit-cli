const { getOptions } = require('loader-utils')

module.exports = async function loader (content) {
  const options = getOptions(this) || {}
  const prefix = `@experienceId: ${options.experienceId};@variationMasterId: ${options.variationMasterId};`
  return `${prefix}\n${content}`
}
