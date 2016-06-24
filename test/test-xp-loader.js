var loader = require('../xp-loader')
var expect = require('chai').expect

describe('xp-loader', function () {
  describe('module.exports', function () {
    it('should add module.exports to the start', function () {
      expect(loader('function () {}')).to.eql('module.exports = function () {}')
    })
  })
  describe('require', function () {
    it('should replace with window.__qubit.amd.require with require', function () {
      expect(loader('require(')).to.eql('module.exports = window.__qubit.amd.require(')
    })
  })
  describe('window.__qubit.amd.require', function () {
    it('should preserve existing window.__qubit.amd.require', function () {
      expect(loader('window.__qubit.amd.require(')).to.eql('module.exports = window.__qubit.amd.require(')
    })
  })
  describe('remember-preview', function () {
    it('should replace remember-preview with no-op', function () {
      expect(loader('require("@qubit/remember-preview"')).to.eql("module.exports = require('no-op'")
      expect(loader("require('@qubit/remember-preview'")).to.eql("module.exports = require('no-op'")
    })
  })
})
