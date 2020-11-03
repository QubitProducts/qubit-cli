const _ = require('lodash')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')
const iterationService = require('../services/iteration')
const placementService = require('../services/placement')
const log = require('./log')
const formatLog = require('./format-log')
const parseUrl = require('./parse-url')
const createApp = require('../server/app')
const {
  term,
  cleanTerminal,
  yesOrNo,
  createAutoComplete
} = require('./terminal')
const { CAMPAIGN_TYPES } = require('../constants')

async function property (message) {
  const suggestions = await getAutoCompleteMap({
    arr: await propertyService.getAll(),
    title: 'name',
    value: 'id'
  })
  if (suggestions.length === 1) {
    return suggestions[0].id
  } else if (message) {
    log.info(message)
  }
  return createAutoComplete(msg(`Select a property (start typing to filter the list)`), suggestions).response()
}

async function experience (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete(msg('Select an experience (start typing to filter the list)'), suggestions).response()
}

async function placement (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await placementService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete(msg('Select a placement (start typing to filter the list)'), suggestions).response()
}

async function location (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await placementService.locations(propertyId),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete(msg('Select a location (start typing to filter the list)'), suggestions).response()
}

async function personalisationType () {
  const suggestions = await getAutoCompleteMap({
    arr: _.map(CAMPAIGN_TYPES, type => ({ name: type.toLowerCase(), id: type })),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete(msg('Select a location (start typing to filter the list)'), suggestions).response()
}

async function iteration (experienceId) {
  const suggestions = await getAutoCompleteMap({
    arr: formatIterationNames(await iterationService.getAll(experienceId)),
    title: 'listName',
    value: 'id'
  })
  return createAutoComplete(msg('Select an iteration (start typing to filter the list)'), suggestions).response()
}

async function both () {
  const propertySuggestions = await getAutoCompleteMap({
    arr: await propertyService.getAll(),
    title: 'name',
    value: 'id'
  })

  // main prompt
  const prompt = msg('Select a property or navigate to an experience in your browser (start typing to filter the list)')

  // start app to monitor browser navigation
  const app = await createApp()
  await app.start()

  // get ids from either the auto-complete picker or from browser navigation
  let result = await new Promise(async (resolve, reject) => {
    // start auto-complete picker
    const ac = createAutoComplete(prompt, propertySuggestions)
    ac.response().then(resolve)

    // monitor browser navigation
    app.post('/connect', async (req, res) => {
      // wrap up and abort auto-complete
      res.end()
      if (!req.body.url) reject(new Error('Request to /connect endpoint received with no params'))
      ac.abort()

      // offer choice to use navigated url
      const [, url] = req.body.url.match(/^https?:\/\/(.+?)\/?$/)
      term(prompt + '\n')
      term.up(4).column(prompt.length + 999)
      term.eraseDisplayBelow()
      term('\n')
      const yesNoPrompt = formatLog(`\n     You just navigated to: ^_${url}^ \n     Do you want to select that experience?`)
      if (await yesOrNo(yesNoPrompt)) {
        // use navigated url
        resolve(parseUrl(req.body.url))
      } else {
        // restart auto-complete picker
        term.up(4).column(1)
        term.eraseDisplayBelow()
        ac.resume()
      }
    })
  })

  // clean up
  await app.stop()
  cleanTerminal()

  // do we still need to get the experience?
  if (_.isNumber(result)) {
    result = {
      propertyId: result,
      experienceId: await experience(result)
    }
  }

  return result
}

async function getAutoCompleteMap ({arr, title, value}) {
  return arr.map((iteree) => ({
    title: ' ' + formatLog(iteree[title]),
    value: iteree[value]
  }))
}

function msg (str) {
  return `\n${formatLog(str, 'warn')}\n`
}

function formatIterationNames (iterations) {
  iterations.forEach(i => {
    i.listName = `${i.name} | ${i.state}`
  })
  let [draft, published] = _.take(iterations, 2)
  draft.listName = `${draft.listName} (Draft)`
  if (published) {
    published.listName = `${published.listName} (Current)`
  }
  return iterations
}

module.exports = { property, experience, iteration, placement, location, personalisationType, both }
