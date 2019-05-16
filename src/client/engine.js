module.exports = function experienceEngine (options, globalFn, triggerFn, variationFn, bypassTriggers) {
  const triggersApi = options.createApi('triggers')
  const variationApi = options.createApi('variation')

  globalFn()

  if (bypassTriggers) {
    triggersApi.log.info('Bypassing triggers')
    triggerFn = () => Promise.resolve({ execute: true })
  } else {
    triggersApi.log.info('Running triggers')
  }

  return triggerFn(triggersApi)
    .then(function activate (result) {
      triggersApi.log.info('Triggers returned ' + result.execute)

      if (!result.execute) return

      variationApi.log.info('Running variation')
      return variationFn(variationApi).catch(variationApi.log.error)
    }, triggersApi.log.error)
}
