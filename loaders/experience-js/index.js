const path = require('path')
const hasNoCode = require('../../src/lib/hasNoCode')
const { TRIGGERS, EXECUTION } = require('../../src/lib/constants')

module.exports = function loader (content, { file }) {
  let filename = path.basename(file)

  let deps = getDeps()

  // Assume a blank file means default empty function
  // This is a better experience than showing errors
  // and when pushing we revert to default function in that case anyway
  let code = content

  if (hasNoCode(code)) {
    if (filename.includes('triggers')) code = TRIGGERS
    if (filename.includes('variation')) code = EXECUTION
  }

  code = addModuleExports(code)

  code = addAMD(code)

  for (let dep of deps) code = allowRealRequires(code, dep)

  return code
}

function addModuleExports (code) {
  return code.includes('module.exports')
    ? code
    : 'module.exports = ' + code
}

function addAMD (code) {
  return code
    .replace(/(^|\s+)require\s*\(/g, '$1window.__qubit.xp.amd.require(')
    .replace(/=\s*require\s*(\n|,|;|$)/g, '= window.__qubit.xp.amd.require$1')
}

function allowRealRequires (code, dep) {
  return code.replace(new RegExp(`window\\.__qubit\\.xp\\.amd\\.require\\((['"])${dep}`, 'gi'), `require($1${dep}`)
}

function getDeps () {
  let deps = {}
  try {
    let pkg = require(path.join(process.cwd(), 'package.json'))
    deps = pkg.dependencies || {}
  } catch (e) {}
  return Object.keys(deps)
}
