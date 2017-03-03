const { expect } = require('chai')
const rewire = require('rewire')
const hasVariations = require('../../src/lib/has-variations')
const pkgFixture = rewire('../fixtures//pkg.json')

describe('hasVariations', function () {
  it('should return true if package has variations', function () {
    expect(hasVariations(pkgFixture)).to.be.ok
  })
})
