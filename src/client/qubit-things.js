module.exports = function qubitThings (thing) {
  let result
  window.__qubit = window.__qubit || {}
  if (window[thing]) result = window[thing]
  // if window.__qubit.uv is there then use that
  if (window.__qubit[thing]) result = window.__qubit[thing]
  return result
}
