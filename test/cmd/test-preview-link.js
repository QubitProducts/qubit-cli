// no package json, no variant inside, no previewUrl, no isControlkey ref'd. etc.
const { expect } = require('chai')
const rewire = require('rewire')
const previewLink = rewire('../../src/cmd/preview-link')

previewLink.__set__('CWD', './test/fixtures/models/packageJsons')

describe.only('previewLink', function () {
  it('should return a promise', function () {
    expect(previewLink()).to.have.property('then')
  })
  it('should log as many links as there are variations', function () {
    previewLink().then((links) => {
      expect(links).to.have.length(2)
    })
  })
  // it('should throw if package.json is missing', () => {
  //   previewLink.__set__('CWD', './test/fixtures/models')
  //   expect(previewLink()).to.throw() // halp
  // })
})
