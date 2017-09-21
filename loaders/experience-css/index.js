module.exports = function (src) {
  return src.replace(/require\(['"]css!([^)]+)['"]/g, function (all, thing) {
    return "require('" + thing + ".css'"
  })
}
