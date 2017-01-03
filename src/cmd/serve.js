const server = require('../server/lib/serve')

module.exports = (variation, opts) => server(Object.assign(opts, { variation }))
