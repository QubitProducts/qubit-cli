const parseUrl = require('../../src/lib/parse-url')
const {expect} = require('chai')

describe('parse url', function () {
  it('should parse the url', function () {
    expect(parseUrl('https://app.qubit.com/p/1234/experiences/5678/editor?vid=890'))
      .to.eql({
        'experienceId': 5678,
        'propertyId': 1234
      })
    expect(parseUrl('https://staging-dashboard.qubitproducts.com/p/1234/experiences/5678/editor?vid=890'))
      .to.eql({
        'experienceId': 5678,
        'propertyId': 1234
      })
    expect(parseUrl('http://localhost:3000/p/1234/experiences/5678/editor?vid=890'))
      .to.eql({
        'experienceId': 5678,
        'propertyId': 1234
      })
  })
})
