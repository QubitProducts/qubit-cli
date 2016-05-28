var variation = require('../variation')
var iteration = require('../iteration')

module.exports = function updateCode (data, codes) {
  return Promise.all([
    variation.set(data, codes),
    iteration.set(data, codes)
  ])
}
