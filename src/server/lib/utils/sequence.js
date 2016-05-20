module.exports = function sequence (arr, fn) {
  return arr.reduce(function (p, item, i) {
    if (!p) return fn(item)
    return p.then(() => fn(item))
  }, false)
}
