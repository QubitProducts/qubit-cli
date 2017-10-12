const chalk = require('chalk')
const codeService = require('../services/code')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
const jsdiff = require('diff')
let CWD = process.cwd()

module.exports = async function checkDiff (propertyId, experienceId) {
  log.info('Comparing files...')
  const files = await codeService.get(propertyId, experienceId)
  const localFiles = await readFiles(CWD)
  delete files['package.json']
  delete localFiles['package.json']
  const fileDiffs = checkDiff(localFiles, files)

  if (fileDiffs.length) {
    log.info('Showing diff between local and remote files...')
    for (let diffObj of fileDiffs) {
      const { fileName, diff } = diffObj
      log.info(`${chalk.blue.bold(fileName)} \n`)
      diff.forEach(parts => {
        const color = parts.added ? 'green' : parts.removed ? 'red' : 'grey'
        log.info(`${chalk[color](parts.value)}`)
      })
    }
  } else {
    log.info('Both versions are the same!')
  }

  function checkDiff (localFiles, files) {
    let diffs = []
    for (let name in files) {
      const remoteVal = files[name] || ''
      const localVal = localFiles[name] || ''
      if (remoteVal !== localVal) {
        const diff = jsdiff.diffLines(remoteVal, localVal, [{ignoreWhitespace: true}])
        diffs.push({fileName: name.toUpperCase(), diff: diff})
      }
    }
    return diffs
  }
}
