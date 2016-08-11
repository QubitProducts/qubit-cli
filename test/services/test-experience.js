const rewire = require('rewire')
const experienceService = rewire('../../src/services/experience')
const variationService = rewire('../../src/services/variation')
const {expect} = require('chai')
const sinon = require('sinon')
const experienceFixture = require('../fixtures/models/experience.json')
const variationsFixture = require('../fixtures/models/variations.json')

describe('experience service', function () {
  let restore, get, put, domain, propertyId, experienceId

  beforeEach(function () {
    get = sinon.stub()
    put = sinon.stub()
    domain = 'mydomain.com'
    propertyId = 123
    experienceId = 321
    restore = experienceService.__set__({
      fetch: { get, put }
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

  describe('code', function () {
    let getVariations
    beforeEach(function () {
      getVariations = sinon.stub().returns(Promise.resolve(variationsFixture))
      restore = experienceService.__set__({
        fetch: { get, put },
        variationService: {
          get: getVariations,
          extract: variationService.extract
        }
      })
      get.returns(Promise.resolve(experienceFixture))
    })
    it('should call fetch with the correct params', function () {
      return experienceService.code(domain, propertyId, experienceId)
        .then((experience) => {
          expect(experience).to.contain.all.keys([
            'globalCode',
            'triggers',
            'id',
            'name',
            'property_id',
            'domain',
            'variations',
            'recent_iterations'
          ])
          expect(experience.variations.length).to.eql(3)
          experience.variations.forEach((variation) => {
            expect(variation).to.contain.all.keys([
              'code',
              'css',
              'id',
              'master_id',
              'is_control'
            ])
          })
        })
    })
  })

  describe('update', function () {
    it('should extract the correct params', function () {})
  })

  describe('extract', function () {
    it('should extract the correct params', function () {})
  })
})

// const variationService = require('./variation')
// let fetch = require('../lib/fetch')
//
// function get (domain, propertyId, experienceId) {
//   return fetch.get(domain, getPath(propertyId, experienceId)).then(resp => resp.data)
// }
//
// function code (domain, propertyId, experienceId) {
//   return Promise.all([
//     get(domain, propertyId, experienceId),
//     variationService.get(domain, propertyId, experienceId)
//   ])
//   .then(([experience, variations]) => {
//     return Object.assign(experience, extract(experience), {
//       domain: domain,
//       variations: variations.map((variation) => Object.assign(variation, variationService.extract(variation)))
//     })
//   })
// }
//
// function update (domain, propertyId, experienceId, globalCode, triggers) {
//   return get(domain, propertyId, experienceId).then(merge).then(put)
//
//   function put (experiment) {
//     return fetch.put(domain, getPath(propertyId, experienceId), { experiment })
//   }
//
//   function merge (resp) {
//     let experience = resp.data
//     let draft = experience.recent_iterations.draft
//     let rules = draft.activation_rules || []
//     let customJs = rules.find(rule => rule.key === 'custom_javascript')
//     if (customJs) {
//       customJs.value = triggers
//     } else {
//       rules.push({
//         key: 'custom_javascript',
//         type: 'code',
//         value: triggers
//       })
//     }
//     Object.assign(draft, {
//       global_code: globalCode,
//       activation_rules: rules
//     })
//     return experience
//   }
// }
//
// function extract (experience) {
//   let iteration = experience.recent_iterations.draft
//   let rule = iteration.activation_rules.find(rule => rule.key === 'custom_javascript')
//   return {
//     globalCode: iteration.global_code,
//     triggers: rule && rule.value
//   }
// }
//
// function getPath (domain, propertyId, experienceId) {
//   return `/p/${propertyId}/smart_serve/experiments/${experienceId}?embed=recent_iterations,schedule,goals`
// }
//
// module.exports = { get, code, update, extract }
