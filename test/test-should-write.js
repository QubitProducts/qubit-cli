const path = require('path')
const {expect} = require('chai')
const sinon = require('sinon')
const rewire = require('rewire')
const shouldWrite = rewire('../src/lib/should-write')
const fixtureDir = path.join(__dirname, 'fixtures')

describe('scaffold', function () {
  let confirmStub, restore, fileExistsStub

  beforeEach(function () {
    fileExistsStub = sinon.stub()
    confirmStub = sinon.stub()
    restore = shouldWrite.__set__({
      checkExists: fileExistsStub,
      confirm: confirmStub
    })
  })

  afterEach(() => restore())

  describe('shouldWrite', function () {
    it('should return true if file does not exist', async () => {
      fileExistsStub.returns(Promise.resolve(false))
      expect(await shouldWrite('a', 'b', 'c', true)).to.eql(true)
    })
    it('should not overwrite if the file exists but is identical to the one being written', async () => {
      fileExistsStub.returns(Promise.resolve(true))
      expect(await shouldWrite(fixtureDir, 'a.js', '1\n', true)).to.eql(false)
    })
    it('should call confirmation handler before overwriting an existing file', async function () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(true))
      await shouldWrite(fixtureDir, 'a.js', '2\n', true)
      expect(confirmStub.calledOnce).to.eql(true)
    })
    it('should overwrite if user confirms its ok to overwrite', async function () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(true))
      expect(await shouldWrite(fixtureDir, 'a.js', '2\n', true)).to.eql(true)
    })
    it('should not overwrite if user says no', async function () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(false))
      expect(await shouldWrite(fixtureDir, 'a.js', '2\n', true)).to.eql(false)
    })
    it('should not overwrite if there is no confirmation handler', async () => {
      fileExistsStub.returns(Promise.resolve(true))
      expect(await shouldWrite('a', 'b', 'c', false)).to.eql(false)
    })
  })
})
