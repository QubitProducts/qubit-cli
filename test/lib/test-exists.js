const path = require('path')
const {expect} = require('chai')
const fs = require('fs-promise')
const fixtures = path.join(__dirname, 'fixtures/tmp/exists')
const FileA = path.join(fixtures, 'a')
const exists = require('../../src/lib/exists')

describe('exists', function () {
  beforeEach(() => fs.createFile(FileA))
  afterEach(() => fs.remove(fixtures))

  it('should return true if file exists', async function () {
    expect(await exists(FileA)).to.eql(true)
  })

  it('should return false if file exists', async function () {
    await fs.remove(FileA)
    expect(await exists(FileA)).to.eql(false)
  })
})
