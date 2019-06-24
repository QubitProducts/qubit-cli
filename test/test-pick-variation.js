const { expect } = require('chai')
const pickVariation = require('../src/lib/pick-variation')

describe('previewLink', function () {
  it('should return the last one', function () {
    expect(pickVariation(['variation-1.js', 'variation-2.js'])).to.eql('variation-2.js')
  })
})
