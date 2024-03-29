const _ = require('lodash')
const { expect } = require('chai')
const pkgService = require('../../src/services/pkg')
const pkgFixture = require('../fixtures/pkg.json')
const propertyFixture = require('../fixtures/property.json')
const experienceFixture = require('../fixtures/experience.json')
const goalsFixture = require('../fixtures/goals.json')
const qfnsFixture = require('../fixtures/qfns.json')
const variationsFixture = require('../fixtures/variations.json')

describe('pkgService', () => {
  let property, experience, iteration, goals, qfns, variations, pkg

  beforeEach(() => {
    property = _.cloneDeep(propertyFixture)
    experience = _.cloneDeep(experienceFixture)
    iteration = _.cloneDeep(experienceFixture.recent_iterations.draft)
    goals = _.cloneDeep(goalsFixture)
    qfns = _.cloneDeep(qfnsFixture)
    variations = _.cloneDeep(variationsFixture)
    pkg = _.cloneDeep(pkgFixture)
  })

  describe('getCode', function () {
    it('should build a package.json file from an experience and its variations', () => {
      expect(
        JSON.parse(
          pkgService.getCode(
            property,
            experience,
            iteration,
            goals,
            qfns,
            variations
          )['package.json']
        )
      ).to.eql(pkgFixture)
    })
  })

  describe('setCode', () => {
    it('should modify an experience object appropriately given a package.json', () => {
      const files = {}
      pkg.meta.name = 'new-name'
      pkg.meta.previewUrl = 'new-url'

      const expectedExperience = _.cloneDeep(experience)
      expectedExperience.name = pkg.meta.name

      const expectedIteration = _.cloneDeep(iteration)
      expectedIteration.url = pkg.meta.previewUrl
      files['package.json'] = JSON.stringify(pkg)
      delete pkg.meta
      expectedIteration.package_json = pkg

      const setCall = pkgService.setCode(experience, iteration, files)
      expect(setCall.experience).to.eql(expectedExperience)
      expect(setCall.iteration).to.eql(expectedIteration)
    })
  })
})
