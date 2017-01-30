const _ = require('lodash')
const path = require('path')
const fs = require('fs-promise')
const input = require('input')
const execa = require('execa')
const getPkg = require('../lib/get-pkg')
const readFiles = require('../lib/read-files')
const scaffold = require('../lib/scaffold')
const log = require('../lib/log')

let CWD = process.cwd()

module.exports = async function templatize () {
  let pkg = await getPkg().catch()

  if (!pkg) return log('nothing to templatize, try running xp pull first!')

  let tmpPkg = { version: '1.0.0', main: 'index.js' }

  tmpPkg.name = clean(await input.text('What would you like to call your template?', { default: pkg.name || 'template' }))

  tmpPkg.description = await input.text('Please provide a description:')

  let templateDir = path.join(path.dirname(CWD), tmpPkg.name)

  await fs.ensureDir(path.join(templateDir, 'template'))

  let files = await readFiles(CWD)

  addTemplateVariables(files, pkg)

  _.each(pkg.meta.variations, (variation, filename) => {
    files['variation.js'] = files[`${filename}.js`]
    files['variation.css'] = files[`${filename}.css`]
    delete files[`${filename}.js`]
    delete files[`${filename}.css`]
  })

  files['package.json'] = JSON.stringify({ 'xp-template': tmpPkg.name })

  log(`...creating template at ${templateDir}`)

  await scaffold(path.join(templateDir, 'template'), files, false)

  await fs.writeFile(path.join(templateDir, 'package.json'), JSON.stringify(tmpPkg))

  await fs.writeFile(path.join(templateDir, 'index.js'), '')

  await execa('npm', ['link'], { cwd: templateDir })

  log(`Your template is npm linked and ready to use!`)
}

function addTemplateVariables (files, pkg) {
  _.each(files, (file, filename) => {
    _.each(['propertyId', 'experienceId', 'iterationId'], (key) => {
      files[filename] = addTemplateVariable(pkg.meta, file, key)
    })
    _.each(pkg.meta.variations, (variation) => {
      _.each(['variationId', 'variationMasterId'], (key) => {
        files[filename] = addTemplateVariable(variation, file, key)
      })
    })
  })
}

function addTemplateVariable (meta, file, key) {
  if (!meta[key]) return file
  if (String(meta[key]).length <= 3) return file
  return file.replace(new RegExp(meta[key], 'g'), `<%= ${key} %>`)
}

function clean (name) {
  return name
    .toLowerCase()
    .replace(/^(@[^/]+\/)?(?:xp-tmp-)?(.*)/, (full, scope, name) => (scope || '') + 'xp-tmp-' + name)
    .replace(/[^@a-z0-9/]/g, '-')
}
