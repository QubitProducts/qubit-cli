const readFiles = require('../lib/read-files')
let CWD = process.cwd()

module.exports = async function compare (propertyId, experienceId) {
  for (let name in files) {
    if (files.hasOwnProperty(name)) {
      const value = files[name]
      if (typeof value === 'string') {
        await scaffoldFile(name)
      } else {
        await fs.mkdirp(path.join(dest, name))
        await scaffold(path.join(dest, name), value, neverOverwrite)
      }
    }
  }
}