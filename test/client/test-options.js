const _ = require('lodash')
const rewire = require('rewire')
global.window = {}
const transform = rewire('../../src/client/options')
delete global.window
const expect = require('chai').expect
const pkgFixture = require('../fixtures/pkg.json')
const variationName = Object.keys(pkgFixture.meta.variations)[0]
const testData = { test: 1 }

describe('transform', function () {
  let pkg, restore
  beforeEach(function () {
    pkg = _.cloneDeep(pkgFixture)
    restore = transform.__set__({
      window: {
        location: {
          host: 'cookieDomain'
        }
      }
    })
  })

  afterEach(function () {
    restore()
  })

  it('exports an object with a state attribute', function () {
    expect(transform(pkg, variationName).api).to.have.property('state')
  })

  it('exports an object with a meta attribute', function () {
    expect(transform(pkg, variationName).api).to.have.property('meta')
  })

  describe('state object', function () {
    var state

    beforeEach(function () {
      transform.__set__('experienceState', {})
      state = transform(pkg, variationName).api.state
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
      meta = transform(pkg, variationName).api.meta
    })

    it('gets enriched with a cookieDomain attribute', function () {
      expect(meta.cookieDomain).to.eql('cookieDomain')
    })

    it('gets enriched with a trackingId attribute', function () {
      expect(meta.trackingId).to.eql('tracking_id')
    })

    it('gets enriched with a visitorId attribute', function () {
      expect(meta.visitorId).to.be.a('string')
    })
  })
})
