const { expect } = require('chai')
const pickVariation = require('../src/lib/pick-variation')

describe('previewLink', function () {
  it('should return the last one', function () {
    expect(pickVariation(['1.js', '2.js'])).to.eql('2.js')
  })
})
