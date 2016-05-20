var path = require('path')
var fs = require('fs-promise')
var addExtension = require('../utils/add-extension')

module.exports = function readCode (dir) {
  var names = [
    'activation',
    'execution',
    'global',
    'variation'
  ]
  return Promise.all(names.map(function (name) {
    var src = path.join(dir, addExtension(name))
    return fs.readFile(src)
  }))
  .then(function (codes) {
    var result = {}
    var l = names.length
    while (l--) result[names[l]] = String(codes[l])
    return result
  })
}
