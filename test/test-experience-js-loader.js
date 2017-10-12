const loader = require('../loaders/experience-js/lib/rewrite')
const { expect } = require('chai')

describe('xp-loader', function () {
  describe('with no deps', function () {
    it('should add module.exports to the start', function () {
      expect(loader('function () {}', 'filename')).to.eql('module.exports = function () {}')
    })

    it('should replace sync require with window.__qubit.xp.amd.require', function () {
      expect(loader('require(', 'filename')).to.eql('module.exports = window.__qubit.xp.amd.require(')
    })

    it('should replace async require with window.__qubit.xp.amd.require', function () {
      expect(loader('require( [ "jquery" ]', 'filename')).to.eql('module.exports = window.__qubit.xp.amd.require( [ "jquery" ]')
    })

    it('should preserve existing window.__qubit.xp.amd.require', function () {
      expect(loader('window.__qubit.xp.amd.require(', 'filename')).to.eql('module.exports = window.__qubit.xp.amd.require(')
    })
  })
  describe('with deps', function () {
    it('should add module.exports to the start', function () {
      expect(loader('function () {}', 'filename', true)).to.eql('module.exports = function () {}')
    })

    it('should not replace sync require with window.__qubit.xp.amd.require', function () {
      expect(loader('require(', 'filename', true)).to.eql('module.exports = require(')
    })

    it('should replace async require with window.__qubit.xp.amd.require', function () {
      expect(loader('require( [ "jquery" ]', 'filename', true)).to.eql('module.exports = window.__qubit.xp.amd.require( [ "jquery" ]')
    })

    it('should preserve existing window.__qubit.xp.amd.require', function () {
      expect(loader('window.__qubit.xp.amd.require(', 'filename', true)).to.eql('module.exports = window.__qubit.xp.amd.require(')
    })
  })
})
