const _ = require('lodash')
const path = require('path')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const execa = require('execa')
const getPkg = require('../lib/get-pkg')
let CWD = process.cwd()
const defaultMeta = {
  name: 'XP experience',
  propertyId: 1,
  experienceId: 2,
  iterationId: 3,
  previewUrl: 'htt://example.com',
  variations: {
    variation: {
      variationIsControl: false,
      variationMasterId: 4,
      variationId: 3
    }
  }
}

_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g

module.exports = async function fromTemplate (name) {
  if (name === 'example') name = path.resolve(__dirname, '../../example-template')
  let output

  const pkg = await getPkg().catch(() => ({}))

  await execa('npm', ['link', name], { cwd: path.resolve(__dirname, '../../') })

  output = await getTemplateFiles(name)

  if (hasVariations(pkg)) {
    _.each(pkg.meta.variations, (variation, filename) => {
      if (!variation.variationIsControl) {
        output[`${filename}.js`] = output['variation.js']
        output[`${filename}.css`] = output['variation.css']
      }
    })
    delete output['variation.js']
    delete output['variation.css']
  }

  output = resolveTemplateVariables(output, pkg.meta || defaultMeta)

  if (output['package.json']) output['package.json'] = mergePkg(pkg, output['package.json'])

  return await scaffold(CWD, output, false)
}

function resolveTemplateVariables (files, meta) {
  return Object.keys(files).reduce((memo, filename) => {
    let localMeta = Object.assign({}, meta, _.get(meta, `variations.${filename.replace(/\.\w+$/, '')}`))
    let value = typeof files[filename] === 'string'
      ? _.template(files[filename])(localMeta)
      : resolveTemplateVariables(files[filename], localMeta)
    memo[filename] = value
    return memo
  }, {})
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
