const path = require('path')

module.exports = function loader (content) {
  let deps = getDeps()
  let code = content || 'function () {\n\n}'

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
  return code.replace(new RegExp(`window\\.__qubit\\.xp\\.amd\\.require\\(${dep}`, 'gi'), `require(${dep}`)
}

function getDeps () {
  let deps = {}
  try {
    let pkg = require(path.join(process.cwd(), 'package.json'))
    deps = pkg.dependencies || {}
  } catch (e) {}
  return Object.keys(deps)
}
