const path = require('path')
const fs = require('fs-extra')
const {expect} = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const exists = rewire('../../src/lib/exists')
const scaffold = rewire('../../src/lib/scaffold')
const fixtures = path.join(__dirname, 'fixtures/tmp/scaffold')
const FileA = path.join(fixtures, 'a')
const FileC = path.join(fixtures, 'b/c')
const FileE = path.join(fixtures, 'd/e')

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
      'a': 'a',
      'b': {
        'c': 'c'
      }
    }
    return fs.mkdirp(fixtures)
  })

  afterEach(async () => {
    restore()
    return fs.remove(fixtures)
  })

  describe('if shouldWriteStub returns true', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(true)))

    it('should write the file', async function () {
      await scaffold(fixtures, files, false)
      expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
    })

    it('should recursively create nested files in directories', async function () {
      await scaffold(fixtures, files, false)
      expect(await fs.readFile(FileC).then(String)).to.eql(files.b.c)
    })
  })

  describe('if shouldWriteStub returns false', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))
    it('should not write the file', async function () {
      await scaffold(fixtures, files, false)
      expect(await exists(FileA)).to.eql(false)
    })
  })

  describe('neverOverwrite flag', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = true })

      it('should call shouldWriteStub with fixtures, file, value and shouldConfirm=false', async function () {
        await scaffold(fixtures, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtures, 'a', files.a, false])
      })
    })

    describe('if false', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = false })

      it('should call shouldWriteStub with fixtures, file, value and shouldConfirm=true', async function () {
        await scaffold(fixtures, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtures, 'a', files.a, true])
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
        await scaffold(fixtures, files, false, true)
        expect(await exists(FileA), 'file a should exist').to.eql(true)
        expect(await exists(FileC), 'file c should exist').to.eql(true)
        expect(await exists(FileE), 'file r should not exist').to.eql(false)
      })
    })

    describe('if false', function () {
      it('should not remove extraneous files', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(fixtures, files, false, false)
        expect(await exists(FileA)).to.eql(true)
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileE)).to.eql(true)
      })
    })
  })
})
