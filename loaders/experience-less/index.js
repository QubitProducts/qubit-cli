const { getOptions } = require('loader-utils')

module.exports = async function loader (content) {
  const options = getOptions(this) || {}
  if (
    options.experienceId &&
    options.variationMasterId &&
    /variation-[0-9]+\.(less|css)$/.test(this.resource)
  ) {
    return `@experienceId: ${options.experienceId};@variationMasterId: ${options.variationMasterId};\n${content}`
  } else {
    return content
  }
}
