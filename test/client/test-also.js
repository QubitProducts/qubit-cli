const sinon = require('sinon')
const rewire = require('rewire')
const also = rewire('../../src/client/also')
const expect = require('chai').expect

describe('also', function () {
  let db, restore, cm
  beforeEach(function () {
    cm = {
      get: sinon.spy((key) => decodeURIComponent(db[key])),
      val: sinon.spy((key) => decodeURIComponent(db[key])),
      set: sinon.spy((key, val) => (db[key] = decodeURIComponent(val))),
      clearAll: sinon.spy((key) => (delete db[key]))
    }
    db = {}
    restore = also.__set__({ cm })
  })

  afterEach(() => restore())

  describe('when called without any variations', function () {
    beforeEach(() => also(null, 'domain'))
    it('should clear any preview cookies', function () {
      expect(cm.clearAll.calledWith('smartserve_preview')).to.eql(true)
    })
    it('should clear any preexisting forceCreatives', function () {
      expect(cm.clearAll.calledWith('etcForceCreative')).to.eql(true)
    })
    it('should force a creative that does not exist', function () {
      expect(cm.set.calledWith('etcForceCreative', encodeURIComponent('[-1]'))).to.eql(true)
    })
    it('should force a creative that does not exist', function () {
      expect(db).to.eql({ etcForceCreative: '[-1]' })
    })
  })

  describe('when called with some variations', function () {
    beforeEach(() => also([1], 'domain'))
    it('should enable preview mode', function () {
      expect(cm.set.calledWith('smartserve_preview', 'true')).to.eql(true)
    })
    it('should clear any preexisting forceCreatives', function () {
      expect(cm.clearAll.calledWith('etcForceCreative')).to.eql(true)
    })
    it('should force the specified creative', function () {
      expect(cm.set.calledWith('etcForceCreative', encodeURIComponent('[1]'))).to.eql(true)
    })
    it('should force a creative that does not exist', function () {
      expect(db).to.eql({
        etcForceCreative: '[1]',
        smartserve_preview: 'true'
      })
    })
  })
})
