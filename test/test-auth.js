const path = require('path')
const fs = require('fs-promise')
const rewire = require('rewire')
const auth = rewire('../src/lib/auth')
const sinon = require('sinon')
const {expect} = require('chai')
const exists = require('./lib/exists')
const xprcPath = path.join(__dirname, '.xprc')

describe('auth', function () {
  let restore, domain
  beforeEach(function () {
    domain = 'domain.com'
    restore = auth.__set__('xprcPath', sinon.stub().returns(xprcPath))
  })

  afterEach(() => {
    restore()
    return fs.unlink(xprcPath).catch(() => {})
  })

  describe('get', function () {
    it('should return {} if the file does not exist', function () {
      return auth.get(domain).then(function (result) {
        expect(result).to.eql({})
      })
    })
  })

  describe('set', function () {
    let token, type
    beforeEach(function () {
      token = 'nekot'
      type = 'EPYT'
      return auth.set(domain, type, token)
    })

    it(`should create a file at ${xprcPath}`, function () {
      return exists(xprcPath).then((result) => expect(result).to.eql(true))
    })
    it(`should be gettable with get ${xprcPath}`, function () {
      return auth.get(domain).then(function (result) {
        expect(result).to.have.property(type, token)
      })
    })
  })
})