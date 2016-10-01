const _ = require('lodash')
const {expect} = require('chai')
const fixture = require('../fixtures/models/variations.json')
const rewire = require('rewire')
const sinon = require('sinon')
const variationService = rewire('../../src/services/variation')

describe('variation service', function () {
  let restore, get, put, propertyId, experienceId, variationId

  beforeEach(function () {
    get = sinon.stub()
    put = sinon.stub()
    propertyId = 123
    experienceId = 321
    variationId = 50112
    restore = variationService.__set__({
      fetch: { get, put }
    })
  })

  afterEach(() => restore())

  describe('getAll', function () {
    it('should call fetch with the correct params', function () {
      variationService.getAll(propertyId, experienceId)
      expect(get.calledOnce).to.eql(true)
      expect(get.getCall(0).args).to.eql(['/p/123/smart_serve/experiments/321/recent_iterations/draft/variations'])
    })
  })

  describe('update', function () {
    beforeEach(function () {
      sinon.stub(variationService, 'getAll').returns(Promise.resolve(fixture))
      restore = variationService.__set__({
        fetch: { get, put },
        getAll: variationService.getAll
      })
    })

    afterEach(() => variationService.getAll.restore())

    it('should call fetch with the correct params', function () {
      return variationService.update(propertyId, experienceId, '50112', 'code', 'css')
        .then(() => {
          expect(put.calledOnce).to.eql(true)
          expect(put.getCall(0).args).to.eql([
            '/p/123/smart_serve/experiments/321/recent_iterations/draft/variations/' + variationId,
            {
              variation: Object.assign({}, fixture.find((v) => v.id === variationId), {
                execution_code: 'code',
                custom_styles: 'css'
              })
            }
          ])
        })
    })
  })

  describe('extract', function () {
    it('should create a default execution if there isnt one', function () {
      let variation = _.cloneDeep(fixture[1])
      _.set(variation, 'execution_code', false)
      _.set(variation, 'custom_styles', false)
      expect(variationService.extract(variation)).to.eql({
        'variation-49937.css': '',
        'variation-49937.js': 'function variation (cb) {\n\n}'
      })
    })
    it('should extract the correct params', function () {
      expect(variationService.extract(fixture[1])).to.eql({
        'variation-49937.css': 'a {\n color: purple; \n}',
        'variation-49937.js': "function () { console.log('variation 1') }"
      })
    })
  })
})
