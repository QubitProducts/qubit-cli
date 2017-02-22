const path = require('path')
const fs = require('fs-promise')
const {expect} = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const exists = rewire('../src/lib/exists')
const scaffold = rewire('../src/lib/scaffold')
const dest = path.join(__dirname, 'fixtures/scaffold')
const FileA = path.join(dest, 'a.js')
const FileC = path.join(dest, 'b/c.js')
const FileE = path.join(dest, 'd/e.js')

describe('scaffold', function () {
  let shouldWriteStub, shouldRemoveStub, files, restore

  beforeEach(function () {
    shouldWriteStub = sinon.stub()
    shouldRemoveStub = sinon.stub()
    restore = scaffold.__set__({
      shouldWrite: shouldWriteStub,
      shouldRemove: shouldRemoveStub
    })
    files = {
      'a.js': '1\n',
      'b': {
        'c.js': '2\n'
      }
    }
  })

  afterEach(async () => {
    restore()
    await Promise.all([
      fs.remove(FileA),
      fs.remove(path.dirname(FileC)),
      fs.remove(path.dirname(FileE))
    ])
  })

  describe('if shouldWriteStub returns true', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(true)))
    it('should write the file', async function () {
      await scaffold(dest, files, false)
      expect(await fs.readFile(FileA).then(String)).to.eql('1\n')
    })
    it('should recursively create nested files in directories', async function () {
      await scaffold(dest, files, false)
      expect(await fs.readFile(FileC).then(String)).to.eql('2\n')
    })
  })

  describe('if shouldWriteStub returns false', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))
    it('should not write the file', async function () {
      await scaffold(dest, files, false)
      expect(await exists(FileA)).to.eql(false)
    })
  })

  describe('neverOverwrite flag', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = true })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=false', async function () {
        await scaffold(dest, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([dest, 'a.js', files['a.js'], false])
      })
    })

    describe('if false', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = false })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=true', async function () {
        await scaffold(dest, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([dest, 'a.js', files['a.js'], true])
      })
    })
  })

  describe('removeExtraneous flag', function () {
    beforeEach(() => {
      shouldWriteStub.returns(Promise.resolve(true))
      shouldRemoveStub.returns(Promise.resolve(true))
    })

    describe('if true', function () {
      it('should remove extraneous files', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(dest, files, false, true)
        expect(await exists(FileA), 'file a should exist').to.eql(true)
        expect(await exists(FileC), 'file c should exist').to.eql(true)
        expect(await exists(FileE), 'file r should not exist').to.eql(false)
      })
    })

    describe('if false', function () {
      it('should not remove extraneous files', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(dest, files, false, false)
        expect(await exists(FileA)).to.eql(true)
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileE)).to.eql(true)
      })
    })
  })
})
