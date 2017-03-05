const { expect } = require('chai')
const _ = require('lodash')
const mergePkg = require('../../src/lib/merge-pkg')
const rewire = require('rewire')
const pkgFixture = rewire('../fixtures//pkg.json')

describe('mergePkg', function () {
  const localPkg = {}
  const templates = ['template1', 'tempalte2']

  beforeEach(() => {
    _.set(localPkg, 'meta.previewUrl', 'http://another-preview.url')
    _.set(localPkg, 'meta.templates', templates)
  })

  it('should merge 2 json files', function () {
    const mergedPkg = Object.assign({}, pkgFixture)
    _.set(mergedPkg, 'meta.templates', templates)
    expect(mergePkg(localPkg, pkgFixture)).to.eql(mergedPkg)
  })
})
