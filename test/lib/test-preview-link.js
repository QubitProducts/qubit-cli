// no package json, no variant inside, no previewUrl, no isControlkey ref'd. etc.
const _ = require('lodash')
const { expect } = require('chai')
const rewire = require('rewire')
const previewLinks = rewire('../../src/lib/preview-links')
const pkgFixture = require('../fixtures/pkg.json')
const linkFixture = require('../fixtures/links.json')

describe('previewLink', function () {
  let restore

  describe('when use_fragment is true', function () {
    beforeEach(() => {
      restore = previewLinks.__set__({
        propertyService: {
          get: () => Promise.resolve({ use_fragment: true })
        }
      })
    })
    afterEach(() => restore())
    it('should return an array of preview links, one for each variant', async function () {
      expect(await previewLinks(_.cloneDeep(pkgFixture).meta)).to.eql(linkFixture)
    })
  })

  describe('when use_fragment is false', function () {
    beforeEach(() => {
      restore = previewLinks.__set__({
        propertyService: {
          get: () => Promise.resolve({ use_fragment: false })
        }
      })
    })
    afterEach(() => restore())
    it('should return an array of preview links, one for each variant', async function () {
      expect(await previewLinks(_.cloneDeep(pkgFixture).meta)).to.eql(linkFixture.map(l => l.replace('#', '?')))
    })
  })
})
