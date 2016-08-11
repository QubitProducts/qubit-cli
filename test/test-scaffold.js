const path = require('path')
const fs = require('fs-promise')
const {expect} = require('chai')
const rewire = require('rewire')
const sinon = require('sinon')
const fileExists = rewire('./lib/exists')
const scaffold = rewire('../src/lib/scaffold')
const fixtureDir = path.join(__dirname, 'fixtures')
const fixtureC = path.join(fixtureDir, 'c.js')

describe('scaffold', function () {
  let exists, shouldWrite, files, restore

  beforeEach(function () {
    exists = sinon.stub()
    shouldWrite = sinon.stub()
    restore = scaffold.__set__({
      exists: exists,
      shouldWrite: shouldWrite
    })
    files = {
      'c.js': '3\n'
    }
  })

  afterEach(() => {
    restore()
    return fs.unlink(fixtureC).catch((err) => err)
  })

  describe('if shouldWrite returns true', function () {
    beforeEach(() => shouldWrite.returns(Promise.resolve(true)))
    it('should write the file', function () {
      return scaffold(fixtureDir, files, false).then(() => {
        return fs.readFile(fixtureC).then((result) => expect(String(result)).to.eql('3\n'))
      })
    })
  })

  describe('if shouldWrite returns false', function () {
    beforeEach(() => shouldWrite.returns(Promise.resolve(false)))
    it('should not write the file', function () {
      return scaffold(fixtureDir, files, false).then(() => {
        return fileExists(fixtureC).then((result) => expect(result).to.eql(false))
      })
    })
  })

  describe('neverOverwrite flag', function () {
    beforeEach(() => shouldWrite.returns(Promise.resolve(false)))

    describe('if true', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = true })

      it('should call shouldWrite with dest, file, value and shouldConfirm=false', function () {
        return scaffold(fixtureDir, files, neverOverwrite).then(() => {
          expect(shouldWrite.calledOnce).to.eql(true)
          expect(shouldWrite.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], false])
        })
      })
    })

    describe('if false', function () {
      let neverOverwrite
      beforeEach(() => { neverOverwrite = false })

      it('should call shouldWrite with dest, file, value and shouldConfirm=true', function () {
        return scaffold(fixtureDir, files, neverOverwrite).then(() => {
          expect(shouldWrite.calledOnce).to.eql(true)
          expect(shouldWrite.getCall(0).args).to.eql([fixtureDir, 'c.js', files['c.js'], true])
        })
      })
    })
  })
})

describe('shouldWrite', function () {
  let exists, confirm, shouldWrite, restore
  beforeEach(function () {
    exists = sinon.stub()
    confirm = sinon.stub()
    shouldWrite = scaffold.__get__('shouldWrite')
    restore = scaffold.__set__({
      exists: exists,
      confirm: confirm
    })
  })

  afterEach(() => restore())

  it('should return true if file does not exist', function () {
    exists.returns(Promise.resolve(false))
    return shouldWrite('a', 'b', 'c', true).then((result) => expect(result).to.eql(true))
  })
  it('should not overwrite if the file exists but is identical to the one being written', function () {
    exists.returns(Promise.resolve(true))
    return shouldWrite(fixtureDir, 'a.js', '1\n', true).then((result) => expect(result).to.eql(false))
  })
  it('should call confirmation handler before overwriting an existing file', function () {
    exists.returns(Promise.resolve(true))
    confirm.returns(Promise.resolve(true))
    return shouldWrite(fixtureDir, 'a.js', '2\n', true).then((result) => {
      expect(confirm.calledOnce).to.eql(true)
    })
  })
  it('should overwrite if user confirms its ok to overwrite', function () {
    exists.returns(Promise.resolve(true))
    confirm.returns(Promise.resolve(true))
    return shouldWrite(fixtureDir, 'a.js', '2\n', true).then((result) => {
      expect(result).to.eql(true)
    })
  })
  it('should not overwrite if user says no', function () {
    exists.returns(Promise.resolve(true))
    confirm.returns(Promise.resolve(false))
    return shouldWrite(fixtureDir, 'a.js', '2\n', true).then((result) => {
      expect(result).to.eql(false)
    })
  })
  it('should not overwrite if there is no confirmation handler', function () {
    exists.returns(Promise.resolve(true))
    return shouldWrite('a', 'b', 'c', false).then((result) => expect(result).to.eql(false))
  })
})
