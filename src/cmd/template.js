const _ = require('lodash')
const path = require('path')
const execa = require('execa')
const log = require('../lib/log')
const scaffold = require('../lib/scaffold')
const readFiles = require('../lib/read-files')
const getPkg = require('../lib/get-pkg')
const mergePkg = require('../lib/merge-pkg')
const templateName = require('../lib/template-name')
const moduleName = require('../lib/module-name')
const hasVariations = require('../lib/has-variations')
const resolveTemplate = require('../lib/resolve-template')
const cssCodeWarning = require('../lib/css-code-warning')
const commonCodeWarning = require('../lib/common-code-warning')
const ROOT_DIR = path.resolve(__dirname, '../../')
const { STYLE_EXTENSION } = require('../constants')
let CWD = process.cwd()

module.exports = async function template (name) {
  try {
    let output
    const pkg = await getPkg()
    if (name === 'example') name = path.resolve(__dirname, '../../example')

    name = templateName(name)

    await execa('npm', ['link', moduleName(name)], { cwd: ROOT_DIR })

    await commonCodeWarning(CWD)
    await cssCodeWarning(CWD)

    output = await getTemplateFiles(name)

    output = _.mapKeys(output, (val, key) => {
      if (/^common\.js$/.test(key)) key = 'utils.js'
      return key.replace(/\.css$/, '.less')
    })

    if (hasVariations(pkg)) {
      _.each(pkg.meta.variations, (variation, filename) => {
        if (!variation.variationIsControl) {
          output[`${filename}.js`] = output['variation.js']
          output[`${filename}${STYLE_EXTENSION}`] = output[`variation${STYLE_EXTENSION}`]
        }
      })
      delete output['variation.js']
      delete output[`variation${STYLE_EXTENSION}`]
    }

    output = resolveTemplate(output, pkg.meta)

    const outPkg = mergePkg(output['package.json'], pkg)

    outPkg.meta = addTemplateMetrics(outPkg.meta, path.basename(name))

    output['package.json'] = JSON.stringify(outPkg, null, 2)

    return await scaffold(CWD, output, true, null, false)
  } catch (err) {
    log.error(err)
  }
}

async function getTemplateFiles (template) {
  let templateDir = path.dirname(require.resolve(template))
  if (!/\/template$/.test(templateDir)) templateDir = path.join(templateDir, 'template')
  return readFiles(path.join(templateDir))
}

function addTemplateMetrics (meta, templateName) {
  return Object.assign({}, meta, {
    templates: _.uniq(meta.templates.concat([templateName]))
  })
}
