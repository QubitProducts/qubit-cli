const path = require('path')
const fs = require('fs-promise')
const {expect} = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const exists = rewire('../src/lib/exists')
const scaffold = rewire('../src/lib/scaffold')
const fixtureDir = path.join(__dirname, 'fixtures')
const fixtureC = path.join(fixtureDir, 'c.js')
const fixtureE = path.join(fixtureDir, 'd/e.js')

describe('scaffold', function () {
  let shouldWriteStub, files, restore

  beforeEach(function () {
    shouldWriteStub = sinon.stub()
    restore = scaffold.__set__({
      shouldWrite: shouldWriteStub
    })
    files = {
      'c.js': '3\n',
      'd': {
        'e.js': '4\n'
      }
    }
  })

  afterEach(async () => {
    restore()
    await Promise.all([fs.unlink(fixtureC).catch((err) => err), fs.remove(path.join(fixtureDir, 'd'))])
  })

  describe('if shouldWriteStub returns true', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(true)))
    it('should write the file', async function () {
      await scaffold(fixtureDir, files, false)
      expect(await fs.readFile(fixtureC).then(String)).to.eql('3\n')
    })
    it('should recursively create nested files in directories', async function () {
      await scaffold(fixtureDir, files, false)
      expect(await fs.readFile(fixtureE).then(String)).to.eql('4\n')
    })
  })

  describe('if shouldWriteStub returns false', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))
    it('should not write the file', async function () {
      await scaffold(fixtureDir, files, false)
      expect(await exists(fixtureC)).to.eql(false)
    })
  })

  describe('neverOverwrite flag', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = true })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=false', async function () {
        await scaffold(fixtureDir, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], false])
      })
    })

    describe('if false', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = false })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=true', async function () {
        await scaffold(fixtureDir, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], true])
      })
    })
  })
})
