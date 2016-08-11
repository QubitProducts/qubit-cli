const _ = require('lodash')
const rewire = require('rewire')
const experienceCodeService = rewire('../../src/services/experience-code')
const experienceService = rewire('../../src/services/experience')
const variationService = rewire('../../src/services/variation')
const { expect } = require('chai')
const sinon = require('sinon')
const experienceFixture = require('../fixtures/models/experience.json')
const experienceCodeFixture = require('../fixtures/models/experience-code.json')
const variationsFixture = require('../fixtures/models/variations.json')
const filesFixture = require('../fixtures/models/files.json')
const createPackageJson = experienceCodeService.__get__('createPackageJson')
const domain = 'domain.com'
const propertyId = 123
const experienceId = 321

describe('experience code service', function () {
  describe('create package.json', function () {
    it('should create a package.json', function () {
      expect(createPackageJson(Object.assign({}, experienceFixture, { domain })))
        .to.eql({
          "name": 11588,
          "description": "New styles",
          "meta": {
            "domain": "domain.com",
            "experienceId": 11588,
            "propertyId": 2499
          }
        })
    })
  })

  describe('get', function () {
    let restore, getExperienceStub, getVariationStub, scaffoldStub

    beforeEach(function () {
      getExperienceStub = sinon.stub().returns(Promise.resolve(experienceFixture))
      getVariationStub = sinon.stub().returns(Promise.resolve(variationsFixture))
      scaffoldStub = sinon.stub()
      restore = experienceCodeService.__set__({
        experienceService: { get: getExperienceStub, extract: experienceService.extract },
        variationService: Object.assign({}, variationService, { getAll: getVariationStub }),
        scaffold: scaffoldStub
      })
    })

    afterEach(() => restore())

    it('should get experiment and variations and extend them with code', function () {
      return experienceCodeService.get(domain, propertyId, experienceId)
        .then((result) => expect(result).to.eql(experienceCodeFixture))
    })

    describe('down', function () {
      it('should scaffold a project from a remote experience', function () {
        return experienceCodeService.down('dest', domain, propertyId, experienceId)
        .then(() => expect(scaffoldStub.getCall(0).args).to.eql(['dest', filesFixture]))
      })
    })
  })

  describe('update', function () {
    let updateExperience, updateVariation, restore
    beforeEach(function () {
      updateExperience = sinon.stub().returns(Promise.resolve())
      updateVariation = sinon.stub().returns(Promise.resolve())
      restore = experienceCodeService.__set__({
        experienceService: { update: updateExperience },
        variationService: { update: updateVariation, filename: variationService.filename }
      })
    })

    it('should update experience and variations based on a files object', function () {
      let files = _.mapValues(filesFixture, (v) => v + 1)
      return experienceCodeService.update('dest', experienceCodeFixture, files)
        .then(() => {
          expect(updateExperience.getCall(0).args).to.eql([
            "domain.com",
            2499,
            11588,
            files['global.js'],
            files['triggers.js']
          ])
          expect(updateVariation.callCount).to.eql(2)
          experienceCodeFixture.variations.slice(1).forEach((variation, i) => {
            expect(updateVariation.getCall(i).args).to.eql([
              domain,
              experienceCodeFixture.property_id,
              experienceCodeFixture.id,
              variation.id,
              variation.execution_code + 1,
              variation.custom_styles + 1
            ])
          })
        })
    })
  })
})
