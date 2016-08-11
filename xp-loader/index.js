module.exports = function loader (content) {
  return 'module.exports = ' + (content || 'function () {\n\n}')
    .replace(/(^|[^\.])require\(/g, '$1window.__qubit.amd.require(')
    .replace(/window\.__qubit\.amd\.require\(['"]@qubit\/remember\-preview['"]/g, '!(function noop () {}')
}
