const { expect } = require('chai')
const moduleName = require('../../src/lib/module-name')

describe('moduleName', function () {
  it('should return the string itself if it is a path', function () {
    expect(moduleName('/path')).to.eql('/path')
  })
})
