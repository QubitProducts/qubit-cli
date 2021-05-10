const server = require('../server/lib/serve')

module.exports = (variationFileName, opts) =>
  server({ ...opts, fileName: variationFileName })
