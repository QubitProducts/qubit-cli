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
  let shouldWriteStub, shouldRemoveStub, files, restore, shouldConfirm, shouldOverwrite, removeExtraneous

  // shouldConfirm = true, shouldOverwrite = false, removeExtraneous = false
  beforeEach(function () {
    shouldConfirm = true
    shouldOverwrite = false
    removeExtraneous = false
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

  describe('shouldConfirm', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      beforeEach(() => {
        shouldConfirm = true
        shouldOverwrite = false
        removeExtraneous = false
      })

      it('should seek confirmation', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtures, 'a', files.a])
      })

      it('should respect confirmation', async function () {
        shouldWriteStub.returns(Promise.resolve(false))
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await exists(FileA)).to.eql(false)
        shouldWriteStub.returns(Promise.resolve(true))
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        shouldWriteStub.returns(Promise.resolve(true))
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileC).then(String)).to.eql(files.b.c)
      })
    })

    describe('if false', function () {
      beforeEach(() => {
        shouldConfirm = false
        shouldOverwrite = true
        removeExtraneous = false
      })

      it('should not seek confirmation', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(shouldWriteStub.called).to.eql(false)
      })

      it('should not respect confirmation', async function () {
        shouldWriteStub.returns(Promise.resolve(false))
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileC).then(String)).to.eql(files.b.c)
      })
    })
  })

  describe('shouldOverwrite', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      beforeEach(() => {
        shouldConfirm = false
        shouldOverwrite = true
        removeExtraneous = false
      })

      it('should overwrite', async function () {
        await fs.outputFile(FileA, 'blah')
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await fs.readFile(FileC).then(String)).to.eql(files.b.c)
      })
    })

    describe('if false', function () {
      beforeEach(() => {
        shouldConfirm = false
        shouldOverwrite = false
        removeExtraneous = false
      })

      it('should not overwrite', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await exists(FileA)).to.eql(false)
      })

      it('should not recursively create nested files in directories', async function () {
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await exists(FileC)).to.eql(false)
      })
    })
  })

  describe('removeExtraneous flag', function () {
    beforeEach(() => {
      shouldConfirm = true
      shouldOverwrite = false
      removeExtraneous = true
    })

    beforeEach(() => {
      shouldWriteStub.returns(Promise.resolve(true))
      shouldRemoveStub.returns(Promise.resolve(true))
    })

    it('should remove extraneous files', async function () {
      await fs.outputFile(FileE, 'lel')
      expect(await exists(FileE)).to.eql(true)
      await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
      expect(await exists(FileA), 'file a should exist').to.eql(true)
      expect(await exists(FileC), 'file c should exist').to.eql(true)
      expect(await exists(FileE), 'file e should not exist').to.eql(false)
    })

    describe('if flag is false', function () {
      beforeEach(() => (removeExtraneous = false))

      it('should not remove extraneous files', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await exists(FileA)).to.eql(true)
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileE)).to.eql(true)
      })
    })

    describe('confirmation', function () {
      beforeEach(() => (shouldRemoveStub.returns(Promise.resolve(false))))

      it('should respect confirmation', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(fixtures, files, shouldConfirm, shouldOverwrite, removeExtraneous)
        expect(await exists(FileA)).to.eql(true)
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileE)).to.eql(true)
      })
    })
  })
})
