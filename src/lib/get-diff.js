const codeService = require('../services/code')
const preService = require('../services/pre')
const readFiles = require('./read-files')
const jsdiff = require('diff')

module.exports = {
  experience,
  pre
}

async function experience (cwd, propertyId, experienceId, iterationId) {
  const files = await codeService.get(propertyId, experienceId, iterationId)
  const localFiles = await readFiles(cwd)
  delete files['package.json']
  delete localFiles['package.json']
  return jsDiffCheck(localFiles, files)
}

async function pre (cwd, propertyId, revisionType = 'draft') {
  const revision = await preService.get(propertyId, revisionType)
  const localFiles = await readFiles(cwd)
  return jsDiffCheck(localFiles, {
    'pre.js': revision.code,
    'package.json': JSON.stringify(revision.packageJson, null, 2)
  })
}

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
