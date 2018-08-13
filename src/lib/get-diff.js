const codeService = require('../services/code')
const readFiles = require('./read-files')
const jsdiff = require('diff')

module.exports = async function checkDiff (cwd, propertyId, experienceId) {
  const files = await codeService.get(propertyId, experienceId)
  const localFiles = await readFiles(cwd)
  delete files['package.json']
  delete localFiles['package.json']
  return jsDiffCheck(localFiles, files)

  function jsDiffCheck (localFiles, files) {
    let diffs = []
    for (let name in files) {
      const remoteVal = (files[name] || '').trim()
      const localVal = (localFiles[name] || '').trim()
      if (remoteVal !== localVal) {
        let diff = jsdiff.diffWords(remoteVal, localVal, { ignoreWhitespace: true })
        let hasDiff = diff.find(d => d.added || d.removed)
        if (!hasDiff) return diffs
        if (diff.length) {
          diffs.push({ fileName: name, diff: diff })
        }
      }
    }
    return diffs
  }
}
