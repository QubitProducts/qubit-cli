const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const fetch = require('../../src/lib/fetch')
const experienceService = require('../../src/services/experience')
const experienceFixture = require('../fixtures//experience.json')

describe('experienceService', function () {
  let sandbox, experienceId, experience

  beforeEach(() => {
    experienceId = 456
    experience = _.cloneDeep(experienceFixture)
    sandbox = sinon.sandbox.create()
    sandbox.stub(fetch, 'get')
    sandbox.stub(fetch, 'put')
  })

  afterEach(() => sandbox.restore())

  describe('get', function () {
    it('should correctly call fetch', function () {
      experienceService.get(experienceId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        '/api/experiences/456'
      ])
    })
  })

  describe('set', function () {
    it('should correctly call fetch', function () {
      experienceService.set(experienceId, experience)
      let args = fetch.put.getCall(0).args
      expect(fetch.put.calledOnce).to.eql(true)
      expect(args[0]).to.eql('/api/experiences/456')
      expect(args[1]).to.eql({ experiment: experience })
    })
  })
})
