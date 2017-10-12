const _ = require('lodash')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')
const parseUrl = require('./parse-url')
const createApp = require('../server/app')
const {
  term,
  cleanTerminal,
  yesOrNo,
  createAutoComplete
} = require('./terminal')

async function property () {
  const suggestions = await getAutoCompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })
  if (suggestions.length === 1) {
    return suggestions[0].id
  }
  return createAutoComplete('^g^+»^: Select a property (start typing to filter the list)', suggestions).response()
}

async function experience (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete('^g^+»^: Select an experience (start typing to filter the list)', suggestions).response()
}

async function both () {
  const propertySuggestions = await getAutoCompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })

  // main prompt
  const prompt = '^g^+»^: Select a property or navigate to an experience in your browser (start typing to filter the list)'

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
      term.up(1).column(prompt.length + 999)
      term.eraseDisplayBelow()
      term('\n')
      const yesNoPrompt = `  ^g^+›^: You just navigated to: ^_${url}^ \n    Do you want to select that experience?`
      if (await yesOrNo(yesNoPrompt)) {
        // use navigated url
        resolve(parseUrl(req.body.url))
      } else {
        // restart auto-complete picker
        term.up(3).column(1)
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
    title: iteree[title],
    value: iteree[value]
  }))
}

module.exports = {property, experience, both}
