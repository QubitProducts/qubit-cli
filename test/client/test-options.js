require('jsdom-global')()

var rewire = require('rewire')
var transform = rewire('../../src/client/options')
var expect = require('chai').expect
var pkgFixture = require('../fixtures/models/pkg')
var variationName = Object.keys(pkgFixture.meta.variations)[0]
var testData = {
  test: 1
}

describe('transform', function () {
  it('exports an object with a state attribute', function () {
    expect(transform(pkgFixture, variationName)).to.have.property('state')
  })

  it('exports an object with a meta attribute', function () {
    expect(transform(pkgFixture, variationName)).to.have.property('meta')
  })

  describe('state object', function () {
    var state

    beforeEach(function () {
      transform.__set__('experienceState', {})
      state = transform(pkgFixture, variationName).state
    })

    it('has a set function that stores data against a key', function () {
      state.set('testKey', testData)
      expect(transform.__get__('experienceState')['testKey']).to.eql(testData)
    })

    it('has a get function that retrieves data when a key is passed', function () {
      state.set('testKey', testData)
      expect(state.get('testKey')).to.eql(testData)
    })

    it('will return undefined if data is not found', function () {
      expect(state.get('undefinedData')).to.be.an('undefined')
    })
  })

  describe('meta object', function () {
    var meta
    beforeEach(function () {
      meta = transform(pkgFixture, variationName).meta
    })

    it('gets enriched with a cookieDomain attribute', function () {
      expect(meta.cookieDomain).to.eql('')
    })

    it('gets enriched with a trackingId attribute', function () {
      expect(meta.trackingId).to.eql('qubitproducts')
    })

    it('gets enriched with a visitorId attribute', function () {
      expect(meta.visitorId).to.be.a('string')
    })
  })
})
