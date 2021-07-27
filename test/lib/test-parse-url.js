const {
  parseExperienceUrl,
  parsePlacementUrl
} = require('../../src/lib/parse-url')
const { expect } = require('chai')

describe('parseExperienceUrl', function () {
  ;[
    'https://app.qubit.com/p/1234/experiences/5678/editor?vid=890',
    'https://staging-dashboard.qubitproducts.com/p/1234/experiences/5678/editor?vid=890',
    'http://localhost:3000/p/1234/experiences/5678/editor?vid=890'
  ].forEach(url => {
    it(`should parse ${url}`, function () {
      expect(parseExperienceUrl(url)).to.eql({
        experienceId: 5678,
        propertyId: 1234
      })
    })
  })
})

describe('parsePlacementUrl', function () {
  ;[
    'https://app.qubit.com/p/1234/atom/placements/-RY8Zq-4SjOr6nauMen2Yg/create?step=editor&view=schema',
    'https://app-staging.qubit.com/p/1234/atom/placements/-RY8Zq-4SjOr6nauMen2Yg/create?step=editor&view=schema',
    'http://localhost:3000/p/1234/atom/placements/-RY8Zq-4SjOr6nauMen2Yg/create?step=editor&view=schema'
  ].forEach(url => {
    it(`should parse ${url}`, function () {
      expect(parsePlacementUrl(url)).to.eql({
        placementId: '-RY8Zq-4SjOr6nauMen2Yg',
        propertyId: 1234
      })
    })
  })
})
