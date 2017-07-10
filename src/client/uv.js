module.exports = function polyfillUV () {
  let uv
  if (window.uv && window.uv.emit) uv = window.uv
  // if window.__qubit.uv is there then use that
  if (window.__qubit.uv) uv = window.__qubit.uv

  // create UV if it isn't there
  if (!uv) uv = require('@qubit/uv-api')()

  // if window.uv is not there then set it
  if (!window.uv) window.uv = uv

  // if window.__qubit.uv is not there then set it
  if (!window.__qubit.uv) window.__qubit.uv = uv

  return uv
}
