const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const fetch = require('../../src/lib/fetch')
const experienceService = require('../../src/services/experience')
const experienceFixture = require('../fixtures//experience.json')

describe('experienceService', function () {
  let sandbox, propertyId, experienceId, experience

  beforeEach(() => {
    propertyId = 123
    experienceId = 456
    experience = _.cloneDeep(experienceFixture)
    sandbox = sinon.sandbox.create()
    sandbox.stub(fetch, 'get')
    sandbox.stub(fetch, 'put')
  })

  afterEach(() => sandbox.restore())

  describe('get', function () {
    it('should correctly call fetch', function () {
      experienceService.get(propertyId, experienceId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        '/p/123/smart_serve/experiments/456?embed=recent_iterations'
      ])
    })
  })

  describe('set', function () {
    it('should correctly call fetch', function () {
      experienceService.set(propertyId, experienceId, experience)
      let args = fetch.put.getCall(0).args
      expect(fetch.put.calledOnce).to.eql(true)
      expect(args[0]).to.eql('/p/123/smart_serve/experiments/456?embed=recent_iterations')
      let meta = args[1].experiment.meta
      delete args[1].experiment.meta
      expect(args[1]).to.eql({experiment: experience})
      expect(meta.includes('{"xp":{"pushes":1,"lastPush"')).to.eql(true)
    })
  })

  describe('getCode', function () {
    it('should build a files object from an experience', () => {
      expect(experienceService.getCode(experience)).to.eql({
        'global.js': 'console.log("global code")',
        'triggers.js': 'console.log("triggers")'
      })
    })
  })

  describe('setCode', () => {
    it('should modify an experience object appropriately given a files object', () => {
      let newExperience = experienceService.setCode(experience, {
        'global.js': 'console.log("some other global code")',
        'triggers.js': 'console.log("some other triggers")'
      })
      expect(newExperience).to.have.deep.property('recent_iterations.draft.global_code', 'console.log("some other global code")')
      expect(newExperience).to.have.deep.property('recent_iterations.draft.activation_rules.0.value', 'console.log("some other triggers")')
    })
  })
})
