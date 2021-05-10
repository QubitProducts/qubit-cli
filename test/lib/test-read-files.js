const path = require('path')
const fs = require('fs-extra')
const { expect } = require('chai')
const fixtures = path.join(__dirname, 'fixtures/tmp/read-files')
const readFiles = require('../../src/lib/read-files')

describe('read-files', function () {
  beforeEach(() =>
    Promise.all([
      fs.outputFile(path.join(fixtures, 'a'), 'a'),
      fs.outputFile(path.join(fixtures, 'b/c'), 'c')
    ])
  )

  afterEach(() => fs.remove(fixtures))

  it('should create a key value object of all the files in a dir', async function () {
    expect(await readFiles(fixtures)).to.eql({
      a: 'a',
      b: {
        c: 'c'
      }
    })
  })
})
