const _ = require('lodash')
const { expect } = require('chai')
const pkgService = require('../../src/services/pkg')
const pkgFixture = require('../fixtures//pkg.json')
const experienceFixture = require('../fixtures//experience.json')
const variationsFixture = require('../fixtures//variations.json')

describe('pkgService', () => {
  let experience, iteration, variations, pkg

  beforeEach(() => {
    experience = _.cloneDeep(experienceFixture)
    iteration = _.cloneDeep(experienceFixture.recent_iterations.draft)
    variations = _.cloneDeep(variationsFixture)
    pkg = _.cloneDeep(pkgFixture)
  })

  describe('getCode', function () {
    it('should build a package.json file from an experience and its variations', () => {
      expect(JSON.parse(pkgService.getCode(experience, iteration, variations)['package.json'])).to.eql(pkgFixture)
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
      expectedIteration.package_json = JSON.stringify(pkg, null, 2)

      const setCall = pkgService.setCode(experience, iteration, files)
      expect(setCall.experience).to.eql(expectedExperience)
      expect(setCall.iteration).to.eql(expectedIteration)
    })
  })
})
