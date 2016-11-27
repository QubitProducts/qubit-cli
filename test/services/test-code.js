const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const codeService = require('../../src/services/code')
const experienceService = require('../../src/services/experience')
const variationService = require('../../src/services/variation')
const experienceFixture = require('../fixtures/models/experience.json')
const variationsFixture = require('../fixtures/models/variations.json')
const filesFixture = require('../fixtures/models/files')

describe('codeService', function () {
  let sandbox, propertyId, experienceId, experience, variations, files

  beforeEach(() => {
    propertyId = 123
    experienceId = 456
    experience = _.cloneDeep(experienceFixture)
    variations = _.cloneDeep(variationsFixture)
    files = _.cloneDeep(filesFixture)
    sandbox = sinon.sandbox.create()
    sandbox.stub(experienceService, 'get').returns(Promise.resolve(experience))
    sandbox.stub(experienceService, 'set').returns(Promise.resolve())
    sandbox.stub(variationService, 'getAll').returns(Promise.resolve(variations))
    sandbox.stub(variationService, 'set').returns(Promise.resolve())
  })

  afterEach(() => sandbox.restore())

  describe('get', function () {
    it('should fetch experience, variations and translate to a files object', async function () {
      let result = await codeService.get(propertyId, experienceId)
      expect(_.omit(result, 'package.json')).to.eql(_.omit(files, ['package.json']))
      expect(JSON.parse(result['package.json'])).to.eql(JSON.parse(files['package.json']))
    })
  })

  describe('set', function () {
    it('should update models correctly', async function () {
      files = _.mapValues(files, (val, key) => {
        if (key !== 'package.json') return val + 1
        let pkg = JSON.parse(val)
        _.set(pkg, 'meta.name', pkg.meta.name + 1)
        return JSON.stringify(pkg, null, 2)
      })
      await codeService.set(propertyId, experienceId, files)
      expect(experienceService.set.calledOnce).to.eql(true)
      experience.name += 1
      _.set(experience, 'recent_iterations.draft.global_code', files['global.js'])
      _.set(experience, 'recent_iterations.draft.activation_rules.0.value', files['triggers.js'])
      expect(experienceService.set.getCall(0).args).to.eql([propertyId, experienceId, experience])
      expect(variationService.set.callCount).to.eql(2)
      _.each(variations, (variation, i) => {
        if (variation.is_control) return
        expect(variationService.set.getCall(i - 1).args).to.eql([
          propertyId,
          experienceId,
          variation.id,
          Object.assign(variation, {
            execution_code: variation.execution_code + 1,
            custom_styles: variation.custom_styles + 1
          })
        ])
      })
    })
  })
})
