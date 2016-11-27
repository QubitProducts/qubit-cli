const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const fetch = require('../../src/lib/fetch')
const variationService = require('../../src/services/variation')
const variationsFixture = require('../fixtures/models/variations.json')

describe('variationService', function () {
  let sandbox, propertyId, experienceId, variationId, variations

  beforeEach(() => {
    propertyId = 123
    experienceId = 456
    variationId = 789
    variations = _.cloneDeep(variationsFixture)
    sandbox = sinon.sandbox.create()
    sandbox.stub(fetch, 'get')
    sandbox.stub(fetch, 'put')
  })

  afterEach(() => sandbox.restore())

  describe('getAll', function () {
    it('should correctly call fetch', function () {
      variationService.get(propertyId, experienceId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        '/p/123/smart_serve/experiments/456/recent_iterations/draft/variations'
      ])
    })
  })

  describe('get', function () {
    it('should correctly call fetch', function () {
      variationService.get(propertyId, experienceId, variationId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        '/p/123/smart_serve/experiments/456/recent_iterations/draft/variations/789'
      ])
    })
  })

  describe('set', function () {
    it('should correctly call fetch', function () {
      variationService.set(propertyId, experienceId, variationId, variations[0])
      expect(fetch.put.calledOnce).to.eql(true)
      expect(fetch.put.getCall(0).args).to.eql([
        '/p/123/smart_serve/experiments/456/recent_iterations/draft/variations/789',
        {variation: variations[0]}
      ])
    })
  })

  describe('getCode', function () {
    it('should build a files object from a variation', () => {
      expect(variationService.getCode(variations[1])).to.eql({
        'variation-4.js': 'function () { console.log("variation 1") }',
        'variation-4.css': 'a {\n color: purple; \n}'
      })
    })
  })

  describe('setCode', () => {
    it('should modify a variation object appropriately given a files object', () => {
      let newVariation = variationService.setCode(variations[2], {
        'variation-6.js': 'function () { console.log("variation 1") }',
        'variation-6.css': 'a {\n color: purple; \n}'
      })
      expect(newVariation).to.have.deep.property('execution_code', 'function () { console.log("variation 1") }')
      expect(newVariation).to.have.deep.property('custom_styles', 'a {\n color: purple; \n}')
    })
  })
})
