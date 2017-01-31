const {readdir} = require('fs-promise')

module.exports = async function getVariationFileName (cwd) {
  let files = await readdir(cwd)
  files = files.filter(f => /\.js$/.test(f) && !/(triggers|global)/.test(f)).sort().reverse()
  return files[files.length - 1]
}
