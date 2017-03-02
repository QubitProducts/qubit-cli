const _ = require('lodash')
const sinon = require('sinon')
const cookieman = require('cookieman')
const rememberPreview = require('../../src/client/remember-preview')
const expect = require('chai').expect

describe('rememberPreview', function () {
  var db, restorable, originalWindow
  beforeEach(function () {
    db = {}
    restorable = [
      sinon.stub(cookieman, 'set', function (key, val) {
        db[key] = decodeURIComponent(val)
      }),
      sinon.stub(cookieman, 'val', function (key) {
        return decodeURIComponent(db[key])
      }),
      sinon.stub(cookieman, 'get', function (key) {
        return decodeURIComponent(db[key])
      })
    ]
    originalWindow = global.window
    global.window = {
      encodeURIComponent: _.identity,
      decodeURIComponent: _.identity,
      location: {
        host: 'blowtrump.com'
      }
    }
  })

  afterEach(function () {
    global.window = originalWindow
    while (restorable.length) restorable.pop().restore()
  })

  describe('when called without arguments', function () {
    it('will not set cookies', function () {
      rememberPreview()
      expect(cookieman.set.called).to.eql(false)
      expect(db).to.eql({})
    })
  })

  describe('when called with only minutes until the cookies should expire', function () {
    it('will not set preview cookies', function () {
      rememberPreview(30)
      expect(cookieman.set.called).to.eql(false)
      expect(db).to.eql({})
    })
  })

  describe('when called with extra variations to preview', function () {
    it('will set the smartserve_preview cookie', function () {
      rememberPreview(30, [123456])
      expect(db.smartserve_preview).to.eql('true')
    })

    it('will set the etcForceCreative cookie', function () {
      rememberPreview(30, [123, 456])
      expect(db.etcForceCreative).to.eql('[123,456]')
    })

    it('will add a path to the cookies', function () {
      rememberPreview(30, [123456])
      expect(cookieman.set.callCount).to.eql(2)
      expect(cookieman.set.getCall(0).args[2].path).to.eql('/')
      expect(cookieman.set.getCall(1).args[2].path).to.eql('/')
    })
  })
})
