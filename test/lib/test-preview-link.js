// no package json, no variant inside, no previewUrl, no isControlkey ref'd. etc.
const _ = require('lodash')
const { expect } = require('chai')
const rewire = require('rewire')
const previewLinks = rewire('../../src/lib/preview-links')
const pkgFixture = rewire('../fixtures//pkg.json')
const linkFixture = rewire('../fixtures//links.json')

describe('previewLink', function () {
  it('should return an array of preview links, one for each variant', async function () {
    expect(await previewLinks(_.cloneDeep(pkgFixture).meta)).to.eql(linkFixture)
  })
})
