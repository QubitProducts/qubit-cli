const { expect } = require('chai')
const {isName, isUrl, isId, isPath, isSubmodule} = require('../../src/lib/is-type')

describe('isType', function () {
  describe('isName', function () {
    it('should return true if string is a name', function () {
      expect(isName('blue-template')).to.eql(true)
    })

    it('should return false if string contains white space', function () {
      expect(isName('blue template')).to.eql(false)
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

  describe('isId', function () {
    it('should return true if string starts with a digit', function () {
      expect(isId('123')).to.eql(true)
    })

    it('should return false if string does not start with a digit', function () {
      expect(isId('is-not-id')).to.eql(false)
    })
  })
})
