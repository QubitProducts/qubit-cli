const path = require('path')
const {expect} = require('chai')
const sinon = require('sinon')
const fs = require('fs-promise')
const rewire = require('rewire')
const shouldWrite = rewire('../src/lib/should-write')
const fixtures = path.join(__dirname, 'fixtures/tmp/should-write')

describe('shouldWrite', function () {
  let confirmStub, restore, fileExistsStub

  beforeEach(function () {
    fileExistsStub = sinon.stub()
    confirmStub = sinon.stub()
    restore = shouldWrite.__set__({
      checkExists: fileExistsStub,
      confirm: confirmStub
    })
    return fs.outputFile(path.join(fixtures, 'a'), 'a')
  })

  afterEach(() => {
    restore()
    return fs.remove(fixtures)
  })

  it('should return true if file does not exist', async () => {
    fileExistsStub.returns(Promise.resolve(false))
    expect(await shouldWrite(fixtures, 'b', 'c', true)).to.eql(true)
  })

  it('should not overwrite if the file exists but is identical to the one being written', async () => {
    fileExistsStub.returns(Promise.resolve(true))
    expect(await shouldWrite(fixtures, 'a', 'a', true)).to.eql(false)
  })

  it('should call confirmation handler before overwriting an existing file', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(true))
    await shouldWrite(fixtures, 'a', 'b', true)
    expect(confirmStub.calledOnce).to.eql(true)
  })

  it('should overwrite if user confirms its ok to overwrite', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(true))
    expect(await shouldWrite(fixtures, 'a', 'b', true)).to.eql(true)
  })

  it('should not overwrite if user says no', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(false))
    expect(await shouldWrite(fixtures, 'a', 'b', true)).to.eql(false)
  })

  it('should not overwrite if there is no confirmation handler', async () => {
    fileExistsStub.returns(Promise.resolve(true))
    expect(await shouldWrite(fixtures, 'a', 'b', false)).to.eql(false)
  })
})
