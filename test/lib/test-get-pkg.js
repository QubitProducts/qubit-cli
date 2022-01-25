const { expect } = require('chai')
const rewire = require('rewire')
const getPkg = rewire('../../src/lib/get-pkg')
const pkgInCwd = rewire('../..//package.json')

describe('getPkg', function () {
  it('should return package.json from CWD', async function () {
    expect(getPkg()).to.eql(pkgInCwd)
  })

  it('should return {} otherwise', async function () {
    expect(getPkg(__dirname)).to.eql({})
  })
})
