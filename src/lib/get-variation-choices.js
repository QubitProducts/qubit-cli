const _ = require('lodash')

module.exports = function getVariationChoices (variations) {
  const controlKey = Object.keys(variations)[0]
  const allVariations = _.omit(variations, controlKey)

  return _.map(allVariations, variation => {
    return {
      name: variation.name,
      value: variation.master_id
    }
  })
}
