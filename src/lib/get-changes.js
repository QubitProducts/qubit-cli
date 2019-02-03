const codeService = require('../services/code')
const interationService = require('../services/iteration')
const jsdiff = require('diff')

module.exports = async function checkChanges (cwd, propertyId, experienceId) {
  const iterations = await interationService.getAll(experienceId)
  const unpublishedIterationId = iterations[0].state === 'unpublished' ? iterations[0].state : false
  const lastPublishedIterationId = iterations.find(iteration => {
    if (/published|paused/gi.test(iteration.state)) return iteration.id
  })

  if (unpublishedIterationId && lastPublishedIterationId) {
    const lastUnpublishedCode = await codeService.get(propertyId, experienceId, false, iterations[0].id)
    const lastPublishedCode = await codeService.get(propertyId, experienceId, false, iterations[1].id)
    return jsDiffCheck(lastUnpublishedCode, lastPublishedCode)
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
}
