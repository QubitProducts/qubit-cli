const chalk = require('chalk')
const log = require('./log')

module.exports = function logDiff (fileDiffs) {
  for (let diffObj of fileDiffs) {
    const { fileName, diff } = diffObj
    log.error(`Showing diff for ${fileName}`)
    for (let part of diff) {
      const prefix = part.added ? '+' : (part.removed ? '-' : ' ')
      const color = part.added ? 'green' : (part.removed ? 'red' : 'grey')
      part.value.split(/\n+/gi).forEach(l => console.log(chalk[color](`${prefix}    ${l}`)))
    }
  }
}
