const _ = require('lodash')
const rewire = require('rewire')
const experienceService = rewire('../../src/services/experience')
const { expect } = require('chai')
const sinon = require('sinon')
const experienceFixture = require('../fixtures/models/experience.json')

describe('experience service', function () {
  let restore, get, put, domain, propertyId, experienceId, globalCode, triggers

  beforeEach(function () {
    get = sinon.stub()
    put = sinon.stub()
    domain = 'domain.com'
    propertyId = 123
    experienceId = 321
    globalCode = 'console.log("global")'
    triggers = 'console.log("triggers")'
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
      getExperienceStub = sinon.stub().returns(Promise.resolve(experienceFixture))
      restore = experienceService.__set__({
        fetch: {get,
          put
        },
        get: getExperienceStub
      })
    })

    it('should call fetch with the correct params', function () {
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
    it('should extract the correct params', function () {
      expect(experienceService.extract(experienceFixture)).to.eql({
        'global.js': 'console.log("global")',
        'triggers.js': 'console.log("triggers")'
      })
    })
  })
})
