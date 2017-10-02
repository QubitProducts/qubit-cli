const _ = require('lodash')
const { expect } = require('chai')
const sinon = require('sinon')
const fetch = require('../../src/lib/fetch')
const variationService = require('../../src/services/variation')
const variationsFixture = require('../fixtures//variations.json')

describe('variationService', function () {
  let sandbox, iterationId, variationId, variations

  beforeEach(() => {
    iterationId = 456
    variationId = 789
    variations = _.cloneDeep(variationsFixture)
    sandbox = sinon.sandbox.create()
    sandbox.stub(fetch, 'get')
    sandbox.stub(fetch, 'put')
  })

  afterEach(() => sandbox.restore())

  describe('getAll', function () {
    it('should correctly call fetch', function () {
      variationService.getAll(iterationId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        `/api/iterations/${iterationId}/variations`
      ])
    })
  })

  describe('get', function () {
    it('should correctly call fetch', function () {
      variationService.get(variationId)
      expect(fetch.get.calledOnce).to.eql(true)
      expect(fetch.get.getCall(0).args).to.eql([
        `/api/variations/${variationId}`
      ])
    })
  })

  describe('set', function () {
    it('should correctly call fetch', function () {
      variationService.set(variationId, variations[0])
      expect(fetch.put.calledOnce).to.eql(true)
      expect(fetch.put.getCall(0).args).to.eql([
        `/api/variations/${variationId}`,
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
