// no package json, no variant inside, no previewUrl, no isControlkey ref'd. etc.
const _ = require('lodash')
const { expect } = require('chai')
const rewire = require('rewire')
const previewLinks = rewire('../../src/cmd/preview-link')
const pkgFixture = rewire('../fixtures//pkg.json')
const linkFixture = rewire('../fixtures//links.json')

describe('previewLink', function () {
  let restore
  beforeEach(function () {
    restore = previewLinks.__set__({
      getPkg: () => Promise.resolve(_.cloneDeep(pkgFixture))
    })
  })

  afterEach(function () {
    restore()
  })

  it('should return an array of preview links, one for each variant', async function () {
    expect(await previewLinks()).to.eql(linkFixture)
  })
})
