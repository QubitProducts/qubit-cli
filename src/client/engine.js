module.exports = function experienceEngine (
  triggersApi,
  variationApi,
  globalFn,
  triggerFn,
  variationFn,
  bypassTriggers
) {
  globalFn()

  if (bypassTriggers) {
    triggerFn = () => Promise.resolve({ execute: true })
  } else {
    triggersApi.log.info('Running triggers')
  }

  return triggerFn(triggersApi).then(function activate (result) {
    if (!bypassTriggers) { triggersApi.log.info('Triggers returned ' + result.execute) }

    if (!result.execute) return

    variationApi.log.info('Running variation')
    return variationFn(variationApi).catch(variationApi.log.error)
  }, triggersApi.log.error)
}
