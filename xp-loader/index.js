module.exports = function (content) {
  return 'module.exports = ' + content.replace(
    /require\(/g, 'window.__qubit.amd.require('
  )
}