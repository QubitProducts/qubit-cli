const path = require('path')
const {expect} = require('chai')
const sinon = require('sinon')
const fs = require('fs-extra')
const rewire = require('rewire')
const shouldWrite = rewire('../../src/lib/should-write')
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

  it('should write if file does not exist', async () => {
    fileExistsStub.returns(Promise.resolve(false))
    expect(await shouldWrite(fixtures, 'b', 'c')).to.eql(true)
  })

  it('should not write if the files are identical', async () => {
    fileExistsStub.returns(Promise.resolve(true))
    expect(await shouldWrite(fixtures, 'a', 'a')).to.eql(false)
  })

  it('should confirm if the file exists and is different', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(true))
    await shouldWrite(fixtures, 'a', 'b')
    expect(confirmStub.calledOnce).to.eql(true)
  })

  it('should overwrite if user says yes', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(true))
    expect(await shouldWrite(fixtures, 'a', 'b')).to.eql(true)
  })

  it('should not overwrite if user says no', async function () {
    fileExistsStub.returns(Promise.resolve(true))
    confirmStub.returns(Promise.resolve(false))
    expect(await shouldWrite(fixtures, 'a', 'b')).to.eql(false)
  })
})
