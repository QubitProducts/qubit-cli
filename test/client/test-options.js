const _ = require('lodash')
const sinon = require('sinon')
global.window = {}
const transform = require('../../src/client/options')
const expect = require('chai').expect
const pkgFixture = require('../fixtures/pkg.json')
const variationName = Object.keys(pkgFixture.meta.variations)[0]
const testData = { test: 1 }

describe('transform', function () {
  let pkg
  beforeEach(function () {
    pkg = _.cloneDeep(pkgFixture)
    global.window = {
      location: {
        host: 'cookieDomain'
      }
    }
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
      state = transform(pkg, variationName).api.state
    })

    it('has a get and set function that stores data against a key', function () {
      state.set('testKey', testData)
      expect(state.get('testKey')).to.eql(testData)
      state.set('testKey', null)
      expect(state.get('testKey')).to.eql(null)
    })

    it('will return undefined if data is not found', function () {
      expect(state.get('undefinedData')).to.be.an('undefined')
    })
  })

  describe('uv object', function () {
    var clock, uv

    beforeEach(function () {
      clock = sinon.useFakeTimers()
      uv = transform(pkg, variationName).api.uv
    })

    afterEach(() => {
      global.window = {}
      clock.restore()
    })

    it('proxies event methods to jolt', function () {
      setupJolt()
      for (let method of ['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess']) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(false)
      }
      for (let method of ['on', 'once', 'onEventSent', 'onceEventSent']) {
        uv[method](1, 2, 3)
      }
      for (let method of ['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess']) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(true)
      }
    })

    it('defers event methods and then proxies to jolt', function () {
      for (let method of ['on', 'once', 'onEventSent', 'onceEventSent']) {
        uv[method](1, 2, 3)
      }
      setupJolt()
      clock.tick(100)
      for (let method of ['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess']) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(true)
      }
    })

    function setupJolt () {
      global.window = {
        __qubit: {
          jolt: {
            onEnrichment: sinon.stub(),
            onceEnrichment: sinon.stub(),
            onSuccess: sinon.stub(),
            onceSuccess: sinon.stub()
          }
        }
      }
    }
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
