const _ = require('lodash')
const path = require('path')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const exec = require('child_process').exec
const getPkg = require('../lib/get-pkg')
const log = require('../lib/log')
let CWD = process.cwd()
const defaultMeta = {
  name: 'XP experience',
  propertyId: 1,
  experienceId: 2,
  iterationId: 3,
  previewUrl: 'htt://example.com',
  variationIsControl: false,
  variationMasterId: 4,
  variationId: 3
}
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g

module.exports = async function fromTemplate (name) {
  if (name === 'example') name = path.resolve(__dirname, '../../example-template')
  return exec(`npm link ${name}`, {
    cwd: path.resolve(__dirname, '../../')
  }, async (err) => {
    try {
      if (err) return log.error(new Error(`could not find ${name} installed on your system`))
      const template = await getTemplateFiles(name)
      const pkg = await getPkg().catch(() => ({}))
      const files = {}

      // merge package.json instead of overwriting
      if (template['package.json']) files['package.json'] = mergePkg(pkg, template['package.json'])
      if (template['global.js']) files['global.js'] = _.template(template['global.js'])(pkg.meta || defaultMeta)
      if (template['triggers.js']) files['triggers.js'] = _.template(template['triggers.js'])(pkg.meta || defaultMeta)

      // if experience has known variants, seed them from template
      if (hasVariations(pkg)) {
        _.each(pkg.meta.variations, (variation, filename) => {
          if (variation.variationIsControl) return

          const meta = pkg.meta ? Object.assign({}, pkg.meta, variation) : defaultMeta
          // allow templates to contain dynamic content based on package metadata
          if (template['variation.js']) files[`${filename}.js`] = _.template(template['variation.js'])(meta)
          if (template['variation.css']) files[`${filename}.css`] = _.template(template['variation.css'])(meta)
        })
      } else {
        const meta = pkg.meta ? Object.assign({}, pkg.meta) : defaultMeta
        if (template['variation.js']) files['variation.js'] = _.template(template['variation.js'])(meta)
        if (template['variation.css']) files['variation.css'] = _.template(template['variation.css'])(meta)
      }
      return await scaffold(CWD, files, false)
    } catch (err) {
      log.error(err.stack)
    }
  })
}

function hasVariations (pkg) {
  return _.get(pkg, 'meta.variations') && Object.keys(_.get(pkg, 'meta.variations')).length
}

function mergePkg (localPkg, templatePkg) {
  return JSON.stringify(Object.assign({}, localPkg, JSON.parse(templatePkg)), null, 2)
}

async function getTemplateFiles (template) {
  let templateDir = path.dirname(require.resolve(template))
  if (!/\/template$/.test(templateDir)) templateDir = path.join(templateDir, 'template')
  return await readFiles(path.join(templateDir))
}
