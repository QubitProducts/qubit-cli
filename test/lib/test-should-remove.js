const {expect} = require('chai')
const sinon = require('sinon')
const rewire = require('rewire')
const shouldRemove = rewire('../../src/lib/should-remove')

describe('shouldRemove', function () {
  let confirmStub, restore

  beforeEach(async function () {
    confirmStub = sinon.stub()
    restore = shouldRemove.__set__({
      confirm: confirmStub
    })
  })

  afterEach(() => {
    restore()
  })

  it('should return true if file is css or js', async () => {
    confirmStub.returns(Promise.resolve(true))
    expect(await shouldRemove('test.js')).to.eql(true)
    expect(await shouldRemove('test.less')).to.eql(true)
  })

  it('should return false if user does not confirm', async () => {
    confirmStub.returns(Promise.resolve(false))
    expect(await shouldRemove('test.js')).to.eql(false)
    expect(await shouldRemove('test.less')).to.eql(false)
  })
})
