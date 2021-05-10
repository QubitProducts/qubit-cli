const _ = require('slapdash')
const http = require('@qubit/http-api')

const QFN_DEFAULT_REQUEST_TIMEOUT = 1000
const TIMEZONE_OFFSET = new Date().getTimezoneOffset()

// Lifted from https://github.com/qubitdigital/experience-engine/blob/master/lib/util/integration/index.js
module.exports = function createIntegrationApi (
  visitorId,
  experienceMeta,
  qfnMap = {},
  logger
) {
  const meta = {
    source: 'experience',
    visitorId: visitorId,
    experience: {
      experienceId: experienceMeta.experimentId,
      iterationId: experienceMeta.iterationId,
      variationId: experienceMeta.variationId,
      variationMasterId: experienceMeta.variationMasterId,
      isPreview: true
    }
  }
  const gatewayUrl = 'https://integrations.qubit.com'
  return function getIntegration (friendlyId, defaults) {
    defaults = defaults || {}
    const log = logger('integration:' + friendlyId)
    let encodedId = qfnMap[friendlyId]
    if (!encodedId) {
      throw new Error(
        'The integration "' + friendlyId + '" is not linked to this experience'
      )
    }
    encodedId = encodeURIComponent(encodedId)

    return {
      execute: execute,
      schedule: schedule,
      cancel: cancel
    }

    function execute (data, options) {
      const applicableDefaults = _.pick(defaults, ['key', 'data'])
      const payload = createPayload(applicableDefaults, data, options)
      const timeout = getTimeout(options)
      return _sendRequest('execute', '/' + encodedId, payload, timeout)
    }

    function schedule (data, options) {
      const applicableDefaults = _.pick(defaults, [
        'key',
        'data',
        'window',
        'cancelOnConversion',
        'time',
        'delay'
      ])
      let payload = createPayload(applicableDefaults, data, options)
      const timeout = getTimeout(options)
      payload = withAutoTimezone(payload)
      if (!payload.key) {
        log.info(
          'Scheduling without a `key` field can result in duplicate invocations and is not normally recommended. See https://go.qubit.com/integration-keys for more information.'
        )
      }
      return _sendRequest('schedule', '/defer/' + encodedId, payload, timeout)
    }

    function cancel (options) {
      return _sendRequest(
        'cancel',
        '/cancel/' + encodedId,
        _.assign({}, { key: defaults.key }, options)
      )
    }

    function _sendRequest (action, url, body, timeout) {
      log.info('Performing ' + action + ' action')
      const withMeta = _.assign({}, body, { meta: meta })
      return http
        .post(gatewayUrl + url, JSON.stringify(withMeta), { timeout: timeout })
        .catch(function (err) {
          err.type = 'HTTP'
          log.error('HTTP Error: ' + err.message)
          throw err
        })
        .then(function (response) {
          let resp
          try {
            resp = JSON.parse(response)
          } catch (err) {
            err.type = 'MALFORMED_RESPONSE'
            log.error('Error parsing response: ' + err.message)
            throw err
          }
          if (resp.ok) return resp.data
          throw new Error(
            'Failed to perform ' +
              action +
              ' action: ' +
              _.get(resp, 'error.message')
          )
        })
    }
  }
}

function createPayload (applicableDefaults, data, options) {
  const payload = _.assign({}, applicableDefaults, options, { data: data })
  delete payload.timeout
  return payload
}

function getTimeout (options) {
  return (options && options.timeout) || QFN_DEFAULT_REQUEST_TIMEOUT
}

function withAutoTimezone (options) {
  if (options.window && !options.window.timezoneOffset) {
    options.window.timezoneOffset = TIMEZONE_OFFSET
  }
  return options
}
