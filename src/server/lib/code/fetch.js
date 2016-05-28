var iteration = require('../iteration').get
var variation = require('../variation').get

module.exports = function fetchCode (data) {
  return Promise.all([iteration(data), variation(data)])
    .then(function (data) {
      return {
        global: data[0].global_code,
        activation: data[0].custom_segment,
        execution: data[1].execution_code,
        variation: data[1].custom_styles
      }
    })
}
