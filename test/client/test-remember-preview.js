var rememberPreview = require('../../src/client/remember-preview')
var expect = require('chai').expect

describe('rememberPreview', function () {
  var originalDocument
  var originalWindow
  beforeEach(function () {
    originalDocument = global.document
    global.document = {
      cookie: ''
    }

    originalWindow = global.window
    global.window = {
      encodeURIComponent: function () {
        return arguments[0]
      }
    }
  })

  afterEach(function () {
    global.document = originalDocument
    global.window = originalWindow
  })

  describe('when called without arguments', function () {
    it('will not set a cookie', function () {
      rememberPreview()
      expect(document.cookie).to.eql('')
    })
  })

  describe('when called with arguments', function () {
    it('will set preview cookies if additional variations are passed in', function () {
      rememberPreview(30, [123456])
      expect(/etcForceCreative/.test(document.cookie)).to.eql(true)
    })

    it('will not set preview cookies if additional variations are not passed in', function () {
      rememberPreview(30)
      expect(document.cookie).to.eql('')
    })

    it('will not add a cookie domain to the cookies if it is not passed in', function () {
      rememberPreview(30, [123456])
      expect(/domain=\.domain\.com;/.test(document.cookie)).to.eql(false)
    })

    it('will add a cookie domain to the cookies if it is passed in', function () {
      rememberPreview(30, [123456], '.domain.com')
      expect(/domain=\.domain\.com;/.test(document.cookie)).to.eql(true)
    })
  })
})
