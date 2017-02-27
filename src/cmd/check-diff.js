require('colors')
const codeService = require('../services/code')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
const jsdiff = require('diff')
let CWD = process.cwd()

module.exports = async function checkDiff (propertyId, experienceId) {  
  log('Comparing files...')
  const files = await codeService.get(propertyId, experienceId)
  const localFiles = await readFiles(CWD)
  const fileDiffs = checkDiff(localFiles, files)

  if (fileDiffs.length) {
    log('Showing changes to local files...')
    for (let files of fileDiffs) {
      files.forEach(function(part){
        const color = part.added ? 'green' :
          part.removed ? 'red' : 'grey'
        process.stderr.write(part.value[color])
      })
    }
  } else {
    log('Both versions are the same!')
  }
 

  function checkDiff (localFiles, files) {
    let diffs = []
    for (let name in files) {
      if (files.hasOwnProperty(name)) {
        const value = files[name]
        const localValue = localFiles[name]
        if (typeof value === 'string' && name !== 'package.json') {
         const diff = value !== localValue

         if (diff) { // If there is a diff then generate a diff output.
          const diff = jsdiff.diffLines(value, localValue, [{ignoreWhitespace: true}])
          diffs.push(diff)
         }
        }
      }
    }
    return diffs
  }
}