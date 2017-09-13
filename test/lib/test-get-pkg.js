const { expect } = require('chai')
const rewire = require('rewire')
const getPkg = rewire('../../src/lib/get-pkg')
const pkgInCwd = rewire('../..//package.json')

describe('getPkg', function () {
  it('should return package.json from CWD', async function () {
    expect(await getPkg()).to.eql(pkgInCwd)
  })
})
