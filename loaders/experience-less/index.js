const { getOptions } = require('loader-utils')

module.exports = async function (content) {
  const result = await loader(this, content)
  return result
}

async function loader (context, content) {
  const options = getOptions(context) || {}
  if (
    options.experienceId &&
    options.variationMasterId &&
    /variation-[0-9]+\.(less|css)$/.test(context.resource)
  ) {
    return `@experienceId: ${options.experienceId};@variationMasterId: ${
      options.variationMasterId
    };\n${content}`
  } else if (
    options.placementId &&
    /placement.(less|css)$/.test(context.resource)
  ) {
    return `@placementId: ${JSON.stringify(options.placementId)};\n${content}`
  }
  return content
}
