const { expect } = require('chai')
const rewire = require('rewire')
const pkgService = rewire('../../src/services/pkg')
const experienceFixture = require('../fixtures/models/experience-code.json')
const pkgFixture = require('../fixtures/models/pkg.js')
let { cookieDomain, experienceId } = pkgFixture.meta
const parseVariations = pkgService.__get__('parseVariations')
const variationFixture = pkgFixture.meta.variations[Object.keys(pkgFixture.meta.variations)[0]]
console.log(variationFixture)

describe('pkg', () => {
  describe('create', function () {
    it('should create a package.json', () => {
      expect(pkgService.create(Object.assign({}, experienceFixture, { cookieDomain })))
        .to.eql(pkgFixture)
    })
  })
  describe('parse', () => {
    it('should parse package json', () => {
      expect(pkgService.parse(JSON.stringify(pkgFixture))).to.eql(pkgFixture)
    })
    it('should handle an empty file', () => {
      expect(pkgService.parse('')).to.eql({})
    })
  })
  describe('parseVariations', () => {
    it('creates options objects for each variation in the experience', () => {
      expect(parseVariations(experienceFixture.variations, cookieDomain, experienceId)).to.eql(pkgFixture.meta.variations)
    })
  })
  describe('validate', () => {
    it('it should not throw if pkg is valid', () => {
      expect(pkgService.validate(pkgFixture)).to.eql(pkgFixture)
    })
    it('it should throw if experienceId is missing', () => {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          experienceId: null
        })
      }))).to.throw()
    })
    it('it should throw if cookieDomain is missing', () => {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          cookieDomain: null
        })
      }))).to.throw()
    })
    it('it should throw if iterationId is missing', () => {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          iterationId: null
        })
      }))).to.throw()
    })
    it('it should throw if propertyId is missing', () => {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          propertyId: null
        })
      }))).to.throw()
    })
    it('it should throw if variations is missing', () => {
      expect(() => pkgService.validate(Object.assign({}, pkgFixture, {
        meta: Object.assign({}, pkgFixture.meta, {
          variations: null
        })
      }))).to.throw()
    })
    it('it should throw if a variation does not contain a meta object', () => {
      expect(() => pkgService.validate(Object.assign({}, variationFixture, {
        meta: null
      }))).to.throw()
    })
    it('it should throw if a variation\'s meta object does not contain variationMasterId', () => {
      expect(() => pkgService.validate(Object.assign({}, variationFixture, {
        meta: Object.assign({}, variationFixture.meta, {
          variationMasterId: null
        })
      }))).to.throw()
    })
    it('it should throw if a variation\'s meta object does not contain variationIsControl', () => {
      expect(() => pkgService.validate(Object.assign({}, variationFixture, {
        meta: Object.assign({}, variationFixture.meta, {
          variationIsControl: null
        })
      }))).to.throw()
    })
  })
})
