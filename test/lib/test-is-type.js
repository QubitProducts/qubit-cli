const { expect } = require('chai')
const {isName, isUrl, isId, isPath, isSubmodule} = require('../../src/lib/is-type')

describe('isType', function () {
  describe('isName', function () {
    it('should return true if string is a name', function () {
      expect(isName('blue-template')).to.eql(true)
    })

    it('should return false if string is empty', function () {
      expect(isName(' ')).to.eql(false)
    })
  })

  describe('isUrl', function () {
    it('should return true if string starts with "http"', function () {
      expect(isUrl('http://isurl.com')).to.eql(true)
    })

    it('should return false if string does not start with "http"', function () {
      expect(isUrl('//isnoturl.com')).to.eql(false)
    })
  })
})
