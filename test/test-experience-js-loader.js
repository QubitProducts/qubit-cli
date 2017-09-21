const loader = require('../loaders/experience-js')
const {expect} = require('chai')

describe('xp-loader', function () {
  describe('module.exports', function () {
    it('should add module.exports to the start', function () {
      expect(loader('function () {}', { file: '' })).to.eql('module.exports = function () {}')
    })
  })
  describe('require', function () {
    it('should replace require with window.__qubit.xp.amd.require', function () {
      expect(loader('require(', { file: '' })).to.eql('module.exports = window.__qubit.xp.amd.require(')
    })
  })
  describe('window.__qubit.xp.amd.require', function () {
    it('should preserve existing window.__qubit.xp.amd.require', function () {
      expect(loader('window.__qubit.xp.amd.require(', { file: '' })).to.eql('module.exports = window.__qubit.xp.amd.require(')
    })
  })
  describe('requiring something in the local directory pakcage.json', function () {
    it('should allow a real require', function () {
      expect(loader('require("chalk"', { file: '' })).to.eql('module.exports = require("chalk"')
      expect(loader(`require('chalk'`, { file: '' })).to.eql(`module.exports = require('chalk'`)
    })
  })
})
