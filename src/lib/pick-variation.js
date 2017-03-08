module.exports = async function pickVariation (names) {
  names = names.filter(f => /\.js$/.test(f) && !/(triggers|global)/.test(f)).sort().reverse()
  return names[names.length - 1]
}
