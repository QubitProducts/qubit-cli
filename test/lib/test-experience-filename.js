const { expect } = require('chai')
const rewire = require('rewire')
const experienceFilename = require('../../src/lib/experience-filename')
const experienceFixture = rewire('../fixtures//experience.json')

describe('experienceFilename', function () {
  it('should return an experience filename', function () {
    expect(experienceFilename(experienceFixture)).to.eql('new-styles-456')
  })
})
