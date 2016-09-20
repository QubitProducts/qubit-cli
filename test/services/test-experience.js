const _ = require('lodash')
const { expect } = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const experienceFixture = require('../fixtures/models/experience.json')
const experienceService = rewire('../../src/services/experience')

describe('experience service', function () {
  let restore, get, put, domain, propertyId, experienceId, globalCode, triggers

  beforeEach(function () {
    get = sinon.stub()
    put = sinon.stub()
    domain = 'domain.com'
    propertyId = 123
    experienceId = 321
    globalCode = 'console.log("new global code")'
    triggers = 'console.log("new triggers")'
    restore = experienceService.__set__({
      fetch: {get,
        put
      }
    })
  })

  afterEach(() => restore())

  describe('get', function () {
    it('should call fetch with the correct params', function () {
      experienceService.get(domain, propertyId, experienceId)
      expect(get.calledOnce).to.eql(true)
      expect(get.getCall(0).args).to.eql([
        domain,
        '/p/123/smart_serve/experiments/321?embed=recent_iterations,schedule,goals'
      ])
    })
  })

  describe('update', function () {
    let getExperienceStub
    beforeEach(function () {
      getExperienceStub = sinon.stub()
      restore = experienceService.__set__({
        fetch: { get, put },
        get: getExperienceStub
      })
    })

    it('should add activation_rules if there isnt one', function () {
      let fixture = _.cloneDeep(experienceFixture)
      _.set(fixture, 'recent_iterations.draft.activation_rules', '')
      getExperienceStub.returns(Promise.resolve(fixture))
      return experienceService.update(domain, propertyId, experienceId, globalCode, triggers)
        .then(() => {
          let expected = _.cloneDeep(experienceFixture)
          expected.recent_iterations.draft.global_code = globalCode
          expected.recent_iterations.draft.activation_rules[0].value = triggers
          expect(put.calledOnce).to.eql(true)
          expect(put.getCall(0).args).to.eql([
            domain,
            `/p/${propertyId}/smart_serve/experiments/${experienceId}?embed=recent_iterations,schedule,goals`, {
              experiment: expected
            }
          ])
        })
    })

    it('should call fetch with the correct params', function () {
      getExperienceStub.returns(Promise.resolve(_.cloneDeep(experienceFixture)))
      return experienceService.update(domain, propertyId, experienceId, globalCode, triggers)
        .then(() => {
          let expected = _.cloneDeep(experienceFixture)
          expected.recent_iterations.draft.global_code = globalCode
          expected.recent_iterations.draft.activation_rules[0].value = triggers
          expect(put.calledOnce).to.eql(true)
          expect(put.getCall(0).args).to.eql([
            domain,
            `/p/${propertyId}/smart_serve/experiments/${experienceId}?embed=recent_iterations,schedule,goals`, {
              experiment: expected
            }
          ])
        })
    })
  })

  describe('extract', function () {
    it('should create default global/trigger code if experience doesnt have one', function () {
      let fixture = _.cloneDeep(experienceFixture)
      _.set(fixture, 'recent_iterations.draft.global_code', '')
      _.set(fixture, 'recent_iterations.draft.activation_rules', '')
      expect(experienceService.extract(fixture)).to.eql({
        'global.js': '',
        'triggers.js': 'function triggers (options, cb) {\n  cb()\n}'
      })
    })
    it('should extract the correct params', function () {
      expect(experienceService.extract(experienceFixture)).to.eql({
        'global.js': 'console.log("global code")',
        'triggers.js': 'console.log("triggers")'
      })
    })
  })
})
