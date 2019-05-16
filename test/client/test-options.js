const _ = require('lodash')
const sinon = require('sinon')
global.window = {}
const transform = require('../../src/client/options')
const expect = require('chai').expect
const pkgFixture = require('../fixtures/pkg.json')
const variationName = Object.keys(pkgFixture.meta.variations)[0]
const testData = { test: 1 }
const METHODS = ['onEnrichment', 'onceEnrichment', 'onSuccess', 'onceSuccess']
const API = ['on', 'once', 'onEventSent', 'onceEventSent']

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
    expect(transform(pkg, variationName).createApi('blah')).to.have.property('state')
  })

  it('exports an object with a meta attribute', function () {
    expect(transform(pkg, variationName).createApi('blah')).to.have.property('meta')
  })

  describe('state object', function () {
    var state

    beforeEach(function () {
      state = transform(pkg, variationName).createApi('blah').state
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

  describe('segments methods', function () {
    var api

    beforeEach(function () {
      pkg.meta.segments = ['foo']
      const options = transform(pkg, variationName)
      api = options.createApi('blah')
    })

    it('isMemberOf', async function () {
      expect(await api.isMemberOf('foo')).to.equal(true)
      expect(await api.isMemberOf('bar')).to.equal(false)
    })

    it('getMemberships', async function () {
      expect(await api.getMemberships()).to.eql(['foo'])
    })
  })

  describe('uv object', function () {
    var clock, uv

    beforeEach(function () {
      clock = sinon.useFakeTimers()
      uv = transform(pkg, variationName).createApi('blah').uv
    })

    afterEach(() => {
      global.window = {}
      clock.restore()
    })

    it('proxies event methods to jolt', function () {
      setupJolt()
      for (let method of METHODS) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(false)
      }
      for (let method of API) {
        uv[method](1, 2, 3)
      }
      for (let method of METHODS) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(true)
      }
    })

    it('proxies replay', function () {
      setupJolt()
      for (let method of API) {
        uv[method](1, 2, 3).replay()
      }
      for (let method of METHODS) {
        expect(global[method].replay.calledOnce).to.eql(true)
      }
    })

    it('proxies dispose', function () {
      setupJolt()
      for (let method of API) {
        uv[method](1, 2, 3).dispose()
      }
      for (let method of METHODS) {
        expect(global[method].dispose.calledOnce).to.eql(true)
      }
    })

    it('defers event methods and then proxies to jolt', function () {
      for (let method of API) {
        uv[method](1, 2, 3)
      }
      setupJolt()
      clock.tick(100)
      for (let method of METHODS) {
        expect(global.window.__qubit.jolt[method].calledWith(1, 2, 3)).to.eql(true)
      }
    })

    function setupJolt () {
      for (let method of METHODS) {
        global[method] = {
          replay: sinon.stub(),
          dispose: sinon.stub()
        }
      }
      global.window = {
        __qubit: {
          jolt: {
            onEnrichment: sinon.stub().returns(global.onEnrichment),
            onceEnrichment: sinon.stub().returns(global.onceEnrichment),
            onSuccess: sinon.stub().returns(global.onSuccess),
            onceSuccess: sinon.stub().returns(global.onceSuccess)
          }
        }
      }
    }
  })

  describe('meta object', function () {
    var meta
    beforeEach(function () {
      meta = transform(pkg, variationName).createApi('blah').meta
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
