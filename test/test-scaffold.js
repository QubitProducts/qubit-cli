const path = require('path')
const co = require('co')
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
  let shouldWrite, shouldWriteStub, confirmStub, files, restore, fileExistsStub

  beforeEach(function () {
    shouldWrite = scaffold.__get__('shouldWrite')
    fileExistsStub = sinon.stub()
    shouldWriteStub = sinon.stub()
    confirmStub = sinon.stub()
    restore = scaffold.__set__({
      exists: fileExistsStub,
      shouldWrite: shouldWriteStub,
      confirm: confirmStub
    })
    files = {
      'c.js': '3\n',
      'd': {
        'e.js': '4\n'
      }
    }
  })

  afterEach(co.wrap(function * () {
    restore()
    yield [fs.unlink(fixtureC).catch((err) => err), fs.remove(path.join(fixtureDir, 'd'))]
  }))

  describe('if shouldWriteStub returns true', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(true)))
    it('should write the file', co.wrap(function * () {
      yield scaffold(fixtureDir, files, false)
      expect(yield fs.readFile(fixtureC).then(String)).to.eql('3\n')
    }))
    it('should recursively create nested files in directories', co.wrap(function * () {
      yield scaffold(fixtureDir, files, false)
      expect(yield fs.readFile(fixtureE).then(String)).to.eql('4\n')
    }))
  })

  describe('if shouldWriteStub returns false', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))
    it('should not write the file', co.wrap(function * () {
      yield scaffold(fixtureDir, files, false)
      expect(yield exists(fixtureC)).to.eql(false)
    }))
  })

  describe('neverOverwrite flag', function () {
    beforeEach(() => shouldWriteStub.returns(Promise.resolve(false)))

    describe('if true', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = true })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=false', co.wrap(function * () {
        yield scaffold(fixtureDir, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], false])
      }))
    })

    describe('if false', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = false })

      it('should call shouldWriteStub with dest, file, value and shouldConfirm=true', co.wrap(function * () {
        yield scaffold(fixtureDir, files, neverOverwrite)
        expect(shouldWriteStub.calledTwice).to.eql(true)
        expect(shouldWriteStub.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], true])
      }))
    })
  })

  describe('shouldWrite', function () {
    it('should return true if file does not exist', function () {
      fileExistsStub.returns(Promise.resolve(false))
      return shouldWrite('a', 'b', 'c', true).then((result) => expect(result).to.eql(true))
    })
    it('should not overwrite if the file exists but is identical to the one being written', function () {
      fileExistsStub.returns(Promise.resolve(true))
      return shouldWrite(fixtureDir, 'a.js', '1\n', true).then((result) => expect(result).to.eql(false))
    })
    it('should call confirmation handler before overwriting an existing file', co.wrap(function * () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(true))
      yield shouldWrite(fixtureDir, 'a.js', '2\n', true)
      expect(confirmStub.calledOnce).to.eql(true)
    }))
    it('should overwrite if user confirms its ok to overwrite', co.wrap(function * () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(true))
      expect(yield shouldWrite(fixtureDir, 'a.js', '2\n', true)).to.eql(true)
    }))
    it('should not overwrite if user says no', co.wrap(function * () {
      fileExistsStub.returns(Promise.resolve(true))
      confirmStub.returns(Promise.resolve(false))
      expect(yield shouldWrite(fixtureDir, 'a.js', '2\n', true)).to.eql(false)
    }))
    it('should not overwrite if there is no confirmation handler', function () {
      fileExistsStub.returns(Promise.resolve(true))
      return shouldWrite('a', 'b', 'c', false).then((result) => expect(result).to.eql(false))
    })
  })
})
