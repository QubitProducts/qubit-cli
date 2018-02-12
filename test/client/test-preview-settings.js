const sinon = require('sinon')
const rewire = require('rewire')
const previewSettings = rewire('../../src/client/preview-settings')
const expect = require('chai').expect

describe('preview-settings', function () {
  let db, restore, cm, location, reload
  beforeEach(function () {
    db = {}
    cm = {
      get: sinon.spy((key) => [db[key]]),
      val: sinon.spy((key) => db[key]),
      set: sinon.spy((key, val) => (db[key] = val)),
      clearAll: sinon.spy((key) => (delete db[key]))
    }
    location = sinon.stub().returns('https://imgs.xkcd.com/comics/night_sky_2x.png')
    reload = sinon.stub()
    restore = previewSettings.__set__({ cm, location, reload })
  })

  afterEach(() => restore())

  describe('options', function () {
    describe('cleanup', function () {
      it('should clean up all existing cookies', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
        expect(cm.clearAll.calledWith('qb_opts')).to.eql(true)
      })
    })
    describe('cookie options', function () {
      it('should clean up all existing cookies', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
        expect(cm.clearAll.calledWith('qb_opts')).to.eql(true)
      })
    })
    describe('encoding', function () {
      it('should encode values', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
        expect(cm.val('qb_opts')).to.eql(encode({ preview: true, exclude: [1] }))
      })
    })
    describe('include', function () {
      it('should specify the forced creative', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
        expect(decode(cm.val('qb_opts')).experiences).to.eql(void 0)
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' }, [2])
        expect(decode(cm.val('qb_opts')).experiences).to.eql([2])
      })
    })
    describe('exclude', function () {
      it('should exclude experienceId', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
        expect(decode(cm.val('qb_opts')).exclude).to.eql([1])
      })
      it('should exclude additional experienceIds', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' }, null, [2])
        expect(decode(cm.val('qb_opts')).exclude).to.eql([1, 2])
      })
    })
    describe('isPreview', function () {
      it('should specify whether to run in preview mode', function () {
        previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' }, null, [2])
        expect(decode(cm.val('qb_opts')).preview).to.eql(true)
        previewSettings({ experienceId: 1, isPreview: false, cookieDomain: 'domain' }, null, [2])
        expect(decode(cm.val('qb_opts')).preview).to.eql(false)
      })
    })
  })

  describe('reload', function () {
    it('should not reload if the initial cookie value is the same and the url contains no preview params', function () {
      cm.set('qb_opts', encode({ preview: true, exclude: [1] }))
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(reload.called).to.eql(false)
    })

    it('should reload if the initial cookie value is different', function () {
      cm.set('qb_opts', encode({ preview: true, exclude: [2] }))
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(reload.called).to.eql(true)
    })

    it('should reload if the url contains preview params', function () {
      location.returns('https://imgs.xkcd.com/comics/night_sky_2x.png?qb_experiences=1')
      cm.set('qb_opts', encode({ preview: true, exclude: [1] }))
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(reload.called).to.eql(true)
    })

    it('should remove preview params from url', function () {
      location.returns('https://imgs.xkcd.com/comics/night_sky_2x.png?qb_experiences=1')
      cm.set('qb_opts', encode({ preview: true, exclude: [1] }))
      previewSettings({ experienceId: 1, isPreview: true, cookieDomain: 'domain' })
      expect(reload.calledWith('https://imgs.xkcd.com/comics/night_sky_2x.png')).to.eql(true)
    })
  })
})

function decode (str) {
  return JSON.parse(decodeURIComponent(str))
}

function encode (obj) {
  return encodeURIComponent(JSON.stringify(obj))
}
