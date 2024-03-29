const path = require('path')
const hasNoCode = require('../../../src/lib/hasNoCode')
const {
  execution_code: EXECUTION_CODE,
  triggers: TRIGGERS
} = require('@qubit/experience-defaults').custom

module.exports = function rewrite (content, file) {
  const filename = path.basename(file)

  // Assume a blank file means default empty function
  // This is a better experience than showing errors
  // and when pushing we revert to default function in that case anyway
  let code = content

  if (hasNoCode(code)) {
    if (filename.includes('triggers')) code = TRIGGERS
    if (filename.includes('variation')) code = EXECUTION_CODE
  }

  code = addModuleExports(code)

  code = asyncAMD(code)

  return code
}

function addModuleExports (code) {
  return isCommonjs(code) ? code : addExports(code)
}

function asyncAMD (code) {
  return code.replace(/(^|[^.])require(\s*\(\s*[^'"\s])/g, (match, p1, p2) => {
    return `${p1}window.__qubit.cli.amd.require${p2}`
  })
}

function isCommonjs (code) {
  return /(^|\n)\s*module\.exports/m.test(code)
}

function addExports (code) {
  return code.replace(/(^|\n)(\s*)([(\w])/m, '$1$2module.exports = $3')
}
