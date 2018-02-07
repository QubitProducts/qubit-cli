const path = require('path')
const hasNoCode = require('../../../src/lib/hasNoCode')
const { TRIGGERS, EXECUTION } = require('../../../src/constants')

module.exports = function rewrite (content, file, hasDeps) {
  const filename = path.basename(file)

  // Assume a blank file means default empty function
  // This is a better experience than showing errors
  // and when pushing we revert to default function in that case anyway
  let code = content

  if (hasNoCode(code)) {
    if (filename.includes('triggers')) code = TRIGGERS
    if (filename.includes('variation')) code = EXECUTION
  }

  code = addModuleExports(code)

  if (hasDeps) {
    code = asyncAMD(code)
  } else {
    code = everythingAMD(code)
  }

  return code
}

function addModuleExports (code) {
  return code.includes('module.exports')
    ? code
    : 'module.exports = ' + code
}

function everythingAMD (code) {
  return code.replace(/(^|\s+)require\s*\(/g, '$1window.__qubit.xp.amd.require(')
}

function asyncAMD (code) {
  return code.replace(/(?:^|\s+)require\s*\((\s*)\[/g, '$1window.__qubit.xp.amd.require($1[')
}
