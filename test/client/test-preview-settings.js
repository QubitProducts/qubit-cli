const sinon = require('sinon')
const rewire = require('rewire')
const previewSettings = rewire('../../src/client/preview-settings')
const expect = require('chai').expect

describe('preview-settings', function () {
  let db, restore, cm
  beforeEach(function () {
    cm = {
      get: sinon.spy((key) => decodeURIComponent(db[key])),
      val: sinon.spy((key) => decodeURIComponent(db[key])),
      set: sinon.spy((key, val) => (db[key] = decodeURIComponent(val))),
      clearAll: sinon.spy((key) => (delete db[key]))
    }
    db = {}
    restore = previewSettings.__set__({ cm })
  })

  afterEach(() => restore())

  describe('when called without any variations', function () {
    it('should clear all forced creatives', function () {
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(cm.clearAll.calledWith('qb_opts')).to.eql(true)
    })
    it('should exclude experienceId', function () {
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(cm.set.calledWith('qb_opts', encodeURIComponent('{"preview":true,"excluded":[1]}'))).to.eql(true)
      expect(db).to.eql({
        qb_opts: '{"preview":true,"excluded":[1]}'
      })
    })
    it('should set preview mode', function () {
      previewSettings({ experienceId: 2, isPreview: false, cookieDomain: 'domain' })
      expect(cm.set.calledWith('qb_opts', encodeURIComponent('{"preview":false,"excluded":[2]}'))).to.eql(true)
      expect(db).to.eql({
        qb_opts: '{"preview":false,"excluded":[2]}'
      })
    })
  })

  describe('when called with some variations', function () {
    beforeEach(() => previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' }, [1]))
    it('should clear any preexisting forceCreatives', function () {
      expect(cm.clearAll.calledWith('qb_opts')).to.eql(true)
    })
    it('should force the specified creative', function () {
      expect(cm.set.calledWith('qb_opts', encodeURIComponent('{"preview":true,"excluded":[1],"experiences":[1]}'))).to.eql(true)
    })
    it('should force a creative that does not exist', function () {
      expect(db).to.eql({
        qb_opts: '{"preview":true,"excluded":[1],"experiences":[1]}'
      })
    })
  })
})
