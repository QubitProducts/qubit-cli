const _ = require('lodash')
const chalk = require('chalk')
const codeService = require('../services/code')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
const jsdiff = require('diff')
let CWD = process.cwd()

module.exports = async function checkDiff (propertyId, experienceId) {
  log('Comparing files...')
  let diffs = []
  const remoteFiles = await codeService.get(propertyId, experienceId)
  const localFiles = await readFiles(CWD)

  delete remoteFiles['package.json']
  delete localFiles['package.json']

  checkDiffs(localFiles, remoteFiles)
  checkDiffs(remoteFiles, localFiles)
  diffs = _.uniqBy(diffs, 'fileName')

  if (diffs.length) {
    log('Showing diff between local and remote files...')
    for (let diffObj of diffs) {
      const { fileName, diff } = diffObj
      console.log(`${chalk.blue.bold(fileName)} \n`)
      diff.forEach(parts => {
        const color = parts.added ? 'green' : parts.removed ? 'red' : 'grey'
        console.log(`${chalk[color](parts.value)}`)
      })
    }
  } else {
    log('Both versions are the same!')
  }

  function checkDiffs (comparisonFiles, files) {
    for (let name in files) {
      const value = files[name] || ''
      const compVal = comparisonFiles[name] || ''
      if (value !== compVal) {
        const diff = jsdiff.diffLines(value, compVal, [{ignoreWhitespace: true}])
        diffs.push({fileName: name.toUpperCase(), diff: diff})
      }
    }
  }
}
