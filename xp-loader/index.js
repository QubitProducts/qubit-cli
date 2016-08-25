module.exports = function loader (content) {
  return 'module.exports = ' + (content || 'function () {\n\n}')
    .replace(/(^|[^\.])require\(/g, '$1window.__qubit.amd.require(')
}
