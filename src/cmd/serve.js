const server = require('../server/lib/serve')

module.exports = (variationFileName, opts) => server(Object.assign(opts, { variationFileName }))
