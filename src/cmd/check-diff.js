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

  checkDiffs(localFiles, remoteFiles, 'local')
  checkDiffs(remoteFiles, localFiles, 'remote')
  diffs = _.uniqBy(diffs, 'fileName')

  if (diffs.length) {
    log('Showing diff between local and remote files...')
    for (let diffObj of diffs) {
      const { fileName, diff, missingFile } = diffObj
      const msg = `${chalk.red.bold(`- This file does not exist ${missingFile}ly.`)}`
      console.log(`${chalk.blue.bold(fileName)} ${missingFile ? msg : ''}\n`)
      diff.forEach(parts => {
        let color = parts.added ? 'green' : parts.removed ? 'red' : 'grey'
        if (missingFile) {
          color = missingFile === 'local' ? 'red' : 'green'
        }
        console.log(`${chalk[color](parts.value)}`)
      })
    }
  } else {
    log('Both versions are the same!')
  }

  function checkDiffs (comparisonFiles, files, source) {
    for (let name in files) {
      const value = files[name] || ''
      const compVal = comparisonFiles[name] || ''
      const missingFile = comparisonFiles[name] === undefined && source

      if (value !== compVal || missingFile) {
        const diff = jsdiff.diffLines(value, compVal, [{ignoreWhitespace: true}])
        diffs.push({fileName: name.toUpperCase(), diff, missingFile})
      }
    }
  }
}
