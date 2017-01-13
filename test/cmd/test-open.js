const _ = require('lodash')
const sinon = require('sinon')
const { expect } = require('chai')
const rewire = require('rewire')
const open = rewire('../../src/cmd/open')
const pkgFixture = require('../fixtures/models/pkg.json')

describe('open', function () {
  let restore, spawn

  beforeEach(function () {
    restore = open.__set__({
      getPkg: () => Promise.resolve(_.cloneDeep(pkgFixture)),
      spawn: sinon.stub()
    })
    spawn = open.__get__('spawn')
  })

  afterEach(() => {
    restore()
  })

  it('should call spawn to open the browser at the correct URL', async function () {
    await open()
    expect(spawn.calledOnce).to.eql(true)
    expect(spawn.calledWith('open', ['https://app.qubit.com/p/123/experiences/456'])).to.eql(true)
  })
})
