const fs = require('fs-extra')
const { expect } = require('chai')
const qubitrc = require('../../src/lib/qubitrc')
const exists = require('../../src/lib/exists')
const { QUBITRC } = require('../../src/constants')

describe('qubitrc', function () {
  beforeEach(async () => {
    try {
      await fs.move(QUBITRC, QUBITRC + '.bak')
    } catch (e) {}
  })

  afterEach(async () => {
    await fs.remove(QUBITRC).catch(e => {})
    await fs.move(QUBITRC + '.bak', QUBITRC, { overwrite: true }).catch(e => {})
  })

  describe('get', function () {
    it('should return {} if the file does not exist', async () => {
      expect(await qubitrc.get('blah')).to.eql(undefined)
    })

    it('should return undefined if the file is corrupted', async () => {
      await fs.writeFile(QUBITRC, 'a\n\t1: 2')
      expect(await qubitrc.get('Things')).to.eql(undefined)
    })
  })

  describe('set', function () {
    let token, type
    beforeEach(function () {
      token = 'nekot'
      type = 'EPYT'
      return qubitrc.set(type, token)
    })

    it(`should create a file at ${QUBITRC}`, async () => {
      expect(await exists(QUBITRC)).to.eql(true)
    })

    it(`should be gettable with get ${QUBITRC}`, async () => {
      expect(await qubitrc.get(type)).to.eql(token)
    })

    describe('namespacing', function () {
      let NODE_ENV
      beforeEach(function () {
        NODE_ENV = process.env.NODE_ENV
      })

      afterEach(function () {
        process.env.NODE_ENV = NODE_ENV
      })

      it('should be namespaced by environment', async () => {
        process.env.NODE_ENV = 'blah'
        expect(await qubitrc.get(type)).to.eql(undefined)
        process.env.NODE_ENV = NODE_ENV
        expect(await qubitrc.get(type)).to.eql(token)
      })
    })
  })

  describe('unset', function () {
    let token, type
    beforeEach(async () => {
      token = 'nekot'
      type = 'EPYT'
      await qubitrc.set(type, token)
      await qubitrc.unset(type)
    })

    it('should unset the variable', async () => {
      expect(await qubitrc.get(type)).to.eql(undefined)
    })
  })

  describe('unsetEnv', function () {
    let token, type, NODE_ENV, OTHER_NODE_ENV

    beforeEach(async () => {
      NODE_ENV = process.env.NODE_ENV
      token = 'nekot'
      type = 'EPYT'
      await qubitrc.set(type, token)
      OTHER_NODE_ENV = 'blah'
      process.env.NODE_ENV = OTHER_NODE_ENV
      await qubitrc.set(type, token)
    })

    afterEach(function () {
      process.env.NODE_ENV = NODE_ENV
    })

    it('should unset the variable', async () => {
      await qubitrc.unsetEnv()
      expect(await qubitrc.get(type)).to.eql(undefined)
      process.env.NODE_ENV = NODE_ENV
      expect(await qubitrc.get(type)).to.eql(token)
      console.log(await qubitrc.get(type))
    })
  })
})
