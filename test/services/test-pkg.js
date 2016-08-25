const pkgService = require('../../src/services/pkg')
const { expect } = require('chai')
const experienceFixture = require('../fixtures/models/experience.json')
const domain = 'domain.com'
const pkgFixture = {
  name: 'qubit-experience-11588',
  description: 'New styles',
  meta: {
    domain: domain,
    experienceId: 11588,
    propertyId: 2499
  }
}

describe('pkg', function () {
  describe('create', function () {
    it('should create a package.json', function () {
      expect(pkgService.create(Object.assign({}, experienceFixture, { domain })))
        .to.eql(pkgFixture)
    })
  })
  describe('parse', function () {
    it('should parse package json', function () {
      expect(pkgService.parse(JSON.stringify(pkgFixture))).to.eql(pkgFixture)
    })
    it('should handle an empty file', function () {
      expect(pkgService.parse('')).to.eql({})
    })
  })
  describe('validate', function () {
    it('it should not throw if pkg is valid', function () {
      expect(pkgService.validate(pkgFixture)).to.eql(pkgFixture)
    })
    it('it should throw if meta is not there', function () {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: null
      }))).to.throw()
    })
    it('it should throw if experienceId is missing', function () {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          experienceId: null
        })
      }))).to.throw()
    })
    it('it should throw if propertyId is missing', function () {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          propertyId: null
        })
      }))).to.throw()
    })
    it('it should throw if domain is missing', function () {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          domain: null
        })
      }))).to.throw()
    })
  })
})
