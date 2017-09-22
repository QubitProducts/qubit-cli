const fs = require('fs-extra')
const { expect } = require('chai')
const qubitrc = require('../../src/lib/qubitrc')
const exists = require('../../src/lib/exists')
const { QUBITRC } = require('../../src/lib/constants')

describe('qubitrc', function () {
  beforeEach(async () => {
    try {
      await fs.move(QUBITRC, QUBITRC + '.bak')
    } catch (e) {}
  })

  afterEach(async () => {
    try {
      await fs.move(QUBITRC + '.bak', QUBITRC, { overwrite: true })
    } catch (e) {}
  })

  describe('get', function () {
    it('should return {} if the file does not exist', function () {
      return qubitrc.get().then(function (result) {
        expect(result).to.eql({})
      })
    })
  })

  describe('set', function () {
    let token, type
    beforeEach(function () {
      token = 'nekot'
      type = 'EPYT'
      return qubitrc.set(type, token)
    })

    it(`should create a file at ${QUBITRC}`, function () {
      return exists(QUBITRC).then((result) => expect(result).to.eql(true))
    })
    it(`should be gettable with get ${QUBITRC}`, function () {
      return qubitrc.get().then(function (result) {
        expect(result).to.have.property(type, token)
      })
    })
  })
})
