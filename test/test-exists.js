const co = require('co')
const path = require('path')
const {expect} = require('chai')
const fixtures = path.join(__dirname, 'fixtures/tree')
const exists = require('../src/lib/exists')

describe('exists', function () {
  it('should return true if file exists', co.wrap(function * () {
    expect(yield exists(path.join(fixtures, 'a.js'))).to.eql(true)
  }))

  it('should return false if file exists', co.wrap(function * () {
    expect(yield exists(path.join(fixtures, 'z.js'))).to.eql(false)
  }))
})
