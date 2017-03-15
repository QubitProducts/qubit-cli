module.exports = function pickVariation (names) {
  names = names.filter(f => /\.js$/.test(f) && !/(triggers|global)/.test(f)).sort()
  return names[names.length - 1]
}
