const _ = require('lodash')
const sinon = require('sinon')
const { expect } = require('chai')
const rewire = require('rewire')
const open = rewire('../../src/cmd/open')
const pkgFixture = require('../fixtures//pkg.json')

describe.skip('open', function () {
  let restore, opn

  beforeEach(function () {
    restore = open.__set__({
      getPkg: () => Promise.resolve(_.cloneDeep(pkgFixture)),
      opn: sinon.stub()
    })
    opn = open.__get__('opn')
  })

  afterEach(() => {
    restore()
  })

  it('should call opn to open the browser at the correct URL', async function () {
    await open()
    expect(opn.calledOnce).to.eql(true)
    expect(opn.calledWith('https://app.qubit.com/p/123/experiences/456', { wait: false })).to.eql(true)
  })
})
