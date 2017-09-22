const qubitThings = require('./qubit-things')

module.exports = function polyfillUV () {
  let uv = qubitThings('uv')
  if (!uv) uv = require('@qubit/uv-api')()
  if (!window.uv) window.uv = uv
  if (!window.__qubit.uv) window.__qubit.uv = uv
  return uv
}
