const _ = require('lodash')
const { expect } = require('chai')
const experienceCodeFixture = require('../fixtures/models/experience-code.json')
const experienceFixture = require('../fixtures/models/experience.json')
const filesFixture = require('../fixtures/models/files.json')
const rewire = require('rewire')
const sinon = require('sinon')
const experienceCodeService = rewire('../../src/services/experience-code')
const experienceService = rewire('../../src/services/experience')
const variationService = rewire('../../src/services/variation')
const experienceHasChanged = experienceCodeService.__get__('experienceHasChanged')
const variationHasChanged = experienceCodeService.__get__('variationHasChanged')
const validateFiles = experienceCodeService.__get__('validateFiles')
const variationsFixture = require('../fixtures/models/variations.json')
const domain = 'domain.com'
const propertyId = 123
const experienceId = 321

describe('experience code service', function () {
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

    describe('writeToLocal', function () {
      it('should scaffold a project from a remote experience', function () {
        return experienceCodeService.writeToLocal('dest', domain, propertyId, experienceId)
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

    afterEach(() => restore())

    it('should update experience and variations based on a files object', function () {
      let files = _.mapValues(filesFixture, (v) => v + 1)
      return experienceCodeService.update('dest', experienceCodeFixture, files)
        .then(() => {
          expect(updateExperience.getCall(0).args).to.eql([
            'domain.com',
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
