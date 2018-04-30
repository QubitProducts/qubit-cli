const experience = require('./experience.json')
const variations = require('./variations.json')
const pkg = require('./pkg.json')
const fields = require('./fields.json')

module.exports = {}
module.exports['package.json'] = JSON.stringify(pkg, null, 2)
module.exports['fields.json'] = JSON.stringify(fields, null, 2)
module.exports['global.js'] = experience.recent_iterations.draft.global_code
module.exports['utils.js'] = experience.recent_iterations.draft.common_code
module.exports['triggers.js'] = experience.recent_iterations.draft.activation_rules[0].value
module.exports[`variation-${variations[1].master_id}.less`] = variations[1].custom_styles
module.exports[`variation-${variations[1].master_id}.js`] = variations[1].execution_code
module.exports[`variation-${variations[2].master_id}.less`] = variations[2].custom_styles
module.exports[`variation-${variations[2].master_id}.js`] = variations[2].execution_code
