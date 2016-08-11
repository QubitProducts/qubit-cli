const path = require('path')
const {expect} = require('chai')
const fixtures = path.join(__dirname, 'fixtures')
const readFiles = require('../src/lib/read-files')

describe('read-files', function () {
  it('should create a key value object of all the files in a dir', function () {
    return readFiles(fixtures).then((results) => expect(results).to.eql({
      'a.js': '1\n',
      'b.js': '2\n'
    }))
  })
})
