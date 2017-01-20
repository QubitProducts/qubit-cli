const _ = require('lodash')
const path = require('path')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const exec = require('child_process').exec
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
let CWD = process.cwd()

module.exports = async function fromTemplate (template) {
  if (template === 'example') template = path.resolve(__dirname, '../../example-template')
  return exec(`npm link ${template}`, {
    cwd: path.resolve(__dirname, '../../')
  }, async (err) => {
    try {
      if (err) return log.error(new Error(`could not find ${template} installed on your system`))
      const templateDir = path.dirname(require.resolve(template))
      const templateFiles = await readFiles(path.join(templateDir))
      const pkg = await getPkg().catch(dummyPkg)
      const files = {}
      // merge package.json instead of overwriting
      if (templateFiles['package.json']) files['package.json'] = JSON.stringify(Object.assign({}, pkg, JSON.parse(templateFiles['package.json'])), null, 2)

      if (templateFiles['global.js']) files['global.js'] = _.template(templateFiles['global.js'])(pkg.meta)
      if (templateFiles['triggers.js']) files['triggers.js'] = _.template(templateFiles['triggers.js'])(pkg.meta)

      // if experience has known variants, seed them from template
      if (_.get(pkg, 'meta.variations') && Object.keys(_.get(pkg, 'meta.variations')).length) {
        _.each(pkg.meta.variations, (variation, filename) => {
          if (variation.variationIsControl) return
          const meta = Object.assign({}, pkg.meta, variation)
          // allow templates to contain dynamic content based on package metadata
          if (templateFiles['variation.js']) files[`${filename}.js`] = _.template(templateFiles['variation.js'])(meta)
          if (templateFiles['variation.css']) files[`${filename}.css`] = _.template(templateFiles['variation.css'])(meta)
        })
      } else {
        const meta = Object.assign({}, pkg.meta)
        if (templateFiles['variation.js']) files['variation.js'] = _.template(templateFiles['variation.js'])(meta)
        if (templateFiles['variation.css']) files['variation.css'] = _.template(templateFiles['variation.css'])(meta)
      }
      return await scaffold(CWD, files, false)
    } catch (err) {
      log.error(err)
    }
  })
}

function dummyPkg () {
  return {
    'name': 'xp-experience-1',
    'description': 'An experience powered by qubit xp',
    'meta': {
      'name': 'New styles',
      'propertyId': 1,
      'experienceId': 2,
      'iterationId': 3,
      'previewUrl': 'http://example.com',
      'variations': {
        'variation': {
          'variationIsControl': false,
          'variationMasterId': 4,
          'variationId': 3
        }
      }
    }
  }
}
