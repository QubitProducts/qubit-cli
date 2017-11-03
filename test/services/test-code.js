const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const codeService = require('../../src/services/code')
const experienceService = require('../../src/services/experience')
const iterationService = require('../../src/services/iteration')
const variationService = require('../../src/services/variation')
const experienceFixture = require('../fixtures//experience.json')
const variationsFixture = require('../fixtures//variations.json')
const filesFixture = require('../fixtures//files')

describe('codeService', function () {
  let sandbox, propertyId, experienceId, iterationId, experience, iteration, variations, files

  beforeEach(() => {
    propertyId = 123
    experienceId = 456
    experience = _.cloneDeep(experienceFixture)
    iteration = _.cloneDeep(experienceFixture.recent_iterations.draft)
    variations = _.cloneDeep(variationsFixture)
    files = _.cloneDeep(filesFixture)
    iteration.schema = files['fields.json']
    sandbox = sinon.sandbox.create()
    sandbox.stub(experienceService, 'get').returns(Promise.resolve(experience))
    sandbox.stub(experienceService, 'set').returns(Promise.resolve())
    sandbox.stub(iterationService, 'get').returns(Promise.resolve(iteration))
    sandbox.stub(iterationService, 'set').returns(Promise.resolve())
    sandbox.stub(variationService, 'getAll').returns(Promise.resolve(variations))
    sandbox.stub(variationService, 'set').returns(Promise.resolve())
  })

  afterEach(() => sandbox.restore())

  describe('get', function () {
    it('should fetch experience, variations and translate to a files object', async function () {
      const result = await codeService.get(propertyId, experienceId)
      expect(_.omit(result, ['package.json', 'fields.json'])).to.eql(_.omit(files, ['package.json', 'fields.json']))
      expect(JSON.parse(result['package.json'])).to.eql(JSON.parse(files['package.json']))
      expect(JSON.parse(result['fields.json'])).to.eql(JSON.parse(files['fields.json']))
    })
  })

  describe('set', function () {
    it('should update models correctly', async function () {
      files = _.mapValues(files, (val, key) => {
        if (key === 'package.json') {
          const pkg = JSON.parse(val)
          _.set(pkg, 'meta.name', pkg.meta.name + 1)
          return JSON.stringify(pkg, null, 2)
        }
        if (key === 'fields.json') {
          const schema = JSON.parse(val)
          schema.groups[0].title += 1
          return JSON.stringify(schema, null, 2)
        }
        return val + 1
      })
      await codeService.set(propertyId, experienceId, files)
      expect(experienceService.set.calledOnce).to.eql(true)
      experience.name += 1
      let [actualExperienceId, actualExperience] = experienceService.set.getCall(0).args
      expect(actualExperienceId).to.eql(experienceId)
      expect(_.omit(actualExperience, 'meta')).to.eql(experience)

      iteration.global_code = files['global.js']
      _.set(iteration, 'activation_rules.0.value', files['triggers.js'])
      iteration.schema = files['fields.json']
      let pkg = JSON.parse(files['package.json'])
      delete pkg.meta
      iteration.package_json = JSON.stringify(pkg, null, 2)
      expect(iterationService.set.callCount).to.eql(1)
      const [actualIterationId, actualIteration] = iterationService.set.getCall(0).args
      expect(actualIterationId).to.eql(iterationId)
      expect(actualIteration).to.eql(iteration)

      let meta = JSON.parse(actualExperience.meta)
      expect(_.omit(meta, ['xp.lastPush', 'xp.version'])).to.eql({
        xp: {
          pushes: 1,
          templates: []
        }
      })
      expect(meta.xp).to.contain.keys('version', 'lastPush')

      expect(variationService.set.callCount).to.eql(2)
      _.each(variations, (variation, i) => {
        if (variation.is_control) return
        expect(variationService.set.getCall(i - 1).args).to.eql([
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
