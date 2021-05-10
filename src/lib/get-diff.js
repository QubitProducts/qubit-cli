const _ = require('lodash')
const codeService = require('../services/code')
const preService = require('../services/pre')
const placementService = require('../services/placement')
const readFiles = require('./read-files')
const jsdiff = require('diff')

module.exports = {
  experience,
  pre,
  placement
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

async function placement (
  cwd,
  propertyId,
  placementId,
  implementationType = 'draft'
) {
  const omitPayload = f => _.omit(f, 'payload.json')
  const remoteFiles = await placementService.get(
    propertyId,
    placementId,
    implementationType
  )
  const localFiles = await readFiles(cwd)
  return jsDiffCheck(omitPayload(localFiles), omitPayload(remoteFiles))
}

function jsDiffCheck (localFiles, files) {
  const diffs = []
  for (const name in files) {
    const remoteVal = (files[name] || '').trim()
    const localVal = (localFiles[name] || '').trim()
    if (remoteVal !== localVal) {
      const diff = jsdiff.diffWords(remoteVal, localVal, {
        ignoreWhitespace: true
      })
      const hasDiff = diff.find(d => d.added || d.removed)
      if (!hasDiff) return diffs
      if (diff.length) {
        diffs.push({ fileName: name, diff: diff })
      }
    }
  }
  return diffs
}
