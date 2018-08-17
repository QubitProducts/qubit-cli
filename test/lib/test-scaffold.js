const path = require('path')
const fs = require('fs-extra')
const {expect} = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const exists = rewire('../../src/lib/exists')
const scaffold = rewire('../../src/lib/scaffold')
const shouldWrite = rewire('../../src/lib/should-write')
const fixtures = path.join(__dirname, 'fixtures/tmp/scaffold')
const FileA = path.join(fixtures, 'a')
const FileC = path.join(fixtures, 'b/c')
const FileE = path.join(fixtures, 'b/e.js')

describe('scaffold', function () {
  let shouldRemoveStub, files, restores, shouldConfirm, shouldOverwrite, removeExtraneous, confirm

  beforeEach(function () {
    restores = []
    shouldConfirm = true
    shouldOverwrite = false
    removeExtraneous = false
    shouldRemoveStub = sinon.stub()
    confirm = sinon.stub()
    restores.push(shouldWrite.__set__({
      confirm,
      clearLine: () => {}
    }))
    restores.push(scaffold.__set__({
      shouldWrite,
      shouldRemove: shouldRemoveStub
    }))
    files = {
      'a': 'a',
      'b': {
        'c': 'c'
      }
    }
    return fs.mkdirp(fixtures)
  })

  afterEach(async () => {
    while (restores.length) restores.pop()()
    return fs.remove(fixtures)
  })

  describe('shouldConfirm', function () {
    beforeEach(() => confirm.returns(Promise.resolve(false)))

    describe('if true', function () {
      beforeEach(() => {
        shouldConfirm = true
        shouldOverwrite = false
        removeExtraneous = false
      })

      it('should seek confirmation', async function () {
        await fs.outputFile(FileA, 'blah')
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(confirm.calledOnce).to.eql(true)
      })

      it('should respect confirmation', async function () {
        confirm.returns(Promise.resolve(false))
        await fs.outputFile(FileA, 'blah')
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileA).then(String)).to.eql('blah')
        confirm.returns(Promise.resolve(true))
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        confirm.returns(Promise.resolve(true))
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
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
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(confirm.called).to.eql(false)
      })

      it('should not respect confirmation', async function () {
        confirm.returns(Promise.resolve(false))
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileC).then(String)).to.eql(files.b.c)
      })
    })
  })

  describe('shouldOverwrite', function () {
    beforeEach(() => confirm.returns(Promise.resolve(false)))

    describe('if true', function () {
      beforeEach(() => {
        shouldConfirm = false
        shouldOverwrite = true
        removeExtraneous = false
      })

      it('should overwrite', async function () {
        await fs.outputFile(FileA, 'blah')
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileA).then(String)).to.eql(files.a)
      })

      it('should recursively create nested files in directories', async function () {
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
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
        await fs.outputFile(FileA, 'blah')
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await fs.readFile(FileA).then(String)).to.eql('blah')
      })

      it('should write', async function () {
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileA)).to.eql(true)
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
      confirm.returns(Promise.resolve(true))
      shouldRemoveStub.returns(Promise.resolve(true))
    })

    it('should remove extraneous files', async function () {
      await fs.outputFile(FileE, 'lel')
      expect(await exists(FileE)).to.eql(true)
      await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
      expect(await exists(FileA), 'file a should exist').to.eql(true)
      expect(await exists(FileC), 'file c should exist').to.eql(true)
      expect(await exists(FileE), 'file e should not exist').to.eql(false)
    })

    describe('if flag is false', function () {
      beforeEach(() => (removeExtraneous = false))

      it('should not remove extraneous files', async function () {
        await fs.outputFile(FileE, 'lel')
        expect(await exists(FileE)).to.eql(true)
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
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
        await scaffold(fixtures, files, { shouldConfirm, shouldOverwrite, removeExtraneous })
        expect(await exists(FileA)).to.eql(true)
        expect(await exists(FileC)).to.eql(true)
        expect(await exists(FileE)).to.eql(true)
      })
    })
  })
})
