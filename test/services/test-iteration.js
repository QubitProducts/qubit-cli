const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const fetch = require('../../src/lib/fetch')
const iterationService = require('../../src/services/iteration')
const experienceFixture = require('../fixtures/experience.json')

describe('iterationService', function () {
  let sandbox, iterationId, iteration

  beforeEach(() => {
    iterationId = 101112
    iteration = _.cloneDeep(experienceFixture.recent_iterations.draft)
    sandbox = sinon.sandbox.create()
    sandbox.stub(fetch, 'get')
    sandbox.stub(fetch, 'put')
  })

  afterEach(() => sandbox.restore())

  describe('get', function () {
    it('should correctly call fetch', function () {
      iterationService.get(iterationId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        '/api/iterations/101112'
      ])
    })
  })

  describe('set', function () {
    it('should correctly call fetch', function () {
      iterationService.set(iterationId, iteration)
      const args = fetch.put.getCall(0).args
      expect(fetch.put.calledOnce).to.eql(true)
      expect(args[0]).to.eql('/api/iterations/101112')
      expect(args[1]).to.eql({ iteration })
    })
  })

  describe('getCode', function () {
    it('should build a files object from an experience', () => {
      expect(iterationService.getCode(iteration)).to.eql({
        'fields.json': '{}',
        'global.js': 'console.log("global code")',
        'common.js': 'console.log("common code")',
        'triggers.js': 'console.log("triggers")'
      })
    })
  })

  describe('setCode', () => {
    it('should modify an experience object appropriately given a files object', () => {
      const newIteration = iterationService.setCode(iteration, {
        'global.js': 'console.log("some other global code")',
        'common.js': 'console.log("some other common code")',
        'triggers.js': 'console.log("some other triggers")'
      })
      expect(newIteration.global_code).to.eql('console.log("some other global code")')
      expect(newIteration.common_code).to.eql('console.log("some other common code")')
      expect(newIteration).to.have.deep.property('activation_rules.0.value', 'console.log("some other triggers")')
    })
  })
})
