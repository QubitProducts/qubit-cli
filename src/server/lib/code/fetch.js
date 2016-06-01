var iteration = require('../iteration').get
var variation = require('../variation').get

module.exports = function fetchCode (data) {
  return Promise.all([iteration(data), variation(data)])
    .then(function (data) {
      var rules = data[0].activation_rules || []
      var customJs = rules.find(rule => rule.key === 'custom_javascript')
      customJs = (customJs && customJs.value) || ''
      return {
        global: data[0].global_code,
        activation: customJs,
        execution: data[1].execution_code,
        variation: data[1].custom_styles
      }
    })
}
