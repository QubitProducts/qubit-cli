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
        previewSettings('cookieDomain', { include: [1], isPreview: true })
        expect(cm.clearAll.calledWith('qb_opts')).to.eql(true)
      })
    })
    describe('encoding', function () {
      it('should encode values', function () {
        previewSettings('cookieDomain', { exclude: [1], isPreview: true })
        expect(cm.val('qb_opts')).to.eql(encode({ exclude: [1], isPreview: true }))
      })
    })
    describe('options', function () {
      it('should drop a cookie with the new preview options', function () {
        previewSettings('cookieDomain', { exclude: [1], isPreview: true })
        expect(decode(cm.val('qb_opts'))).to.eql({ exclude: [1], isPreview: true })
        previewSettings('cookieDomain', { exclude: [3, 2, 1], isPreview: false })
        expect(decode(cm.val('qb_opts'))).to.eql({ exclude: [3, 2, 1], isPreview: false })
      })
    })
  })

  describe('reload', function () {
    it('should not reload if the initial cookie value is the same and the url contains no preview params', function () {
      cm.set('qb_opts', encode({ exclude: [3, 2, 1], isPreview: false }))
      previewSettings('cookieDomain', { exclude: [3, 2, 1], isPreview: false })
      expect(reload.called).to.eql(false)
    })

    it('should reload if the initial cookie value is different', function () {
      cm.set('qb_opts', encode({ exclude: [3, 2, 1], isPreview: false }))
      previewSettings('cookieDomain', { exclude: [4, 3, 2, 1], isPreview: false })
      expect(reload.called).to.eql(true)
    })

    it('should reload if the url contains preview params', function () {
      location.returns('https://imgs.xkcd.com/comics/night_sky_2x.png?qb_experiences=1')
      cm.set('qb_opts', encode({ exclude: [3, 2, 1], isPreview: false }))
      previewSettings('cookieDomain', { exclude: [3, 2, 1], isPreview: false })
      expect(reload.called).to.eql(true)
    })

    it('should remove preview params from url', function () {
      location.returns('https://imgs.xkcd.com/comics/night_sky_2x.png?qb_experiences=1')
      cm.set('qb_opts', encode({ exclude: [3, 2, 1], isPreview: false }))
      previewSettings('cookieDomain', { exclude: [3, 2, 1], isPreview: false })
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
