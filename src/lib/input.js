const input = require('input')

for (var method in input) {
  if (typeof input[method] === 'function') {
    module.exports[method] = proxy(method)
  }
}

function proxy (method) {
  return function proxied () {
    console.log('')
    return input[method].apply(input, arguments)
  }
}
