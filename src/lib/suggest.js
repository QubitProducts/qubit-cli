const _ = require('lodash')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')
const parseUrl = require('./parse-url')
const createApp = require('../server/app')
const {
  term,
  cleanTerminal,
  yesOrNo,
  MultipleChoiceMenu
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
  const prompt = '^g^+»^: Select a property (start typing to filter the list)'
  return new MultipleChoiceMenu(prompt, suggestions).start().response()
}

async function experience (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })
  const prompt = '^g^+»^: Select an experience (start typing to filter the list)'
  return new MultipleChoiceMenu(prompt, suggestions).start().response()
}

async function both () {
  const propertySuggestions = await getAutoCompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })

  /* start app to monitor browser navigation */
  const browserMonitor = await createApp()
  await browserMonitor.start()

  /* start multiple-choice menu */
  const prompt = '^g^+»^: Select a property or navigate to an experience in your browser (start typing to filter the list)'
  const mcMenu = new MultipleChoiceMenu(prompt, propertySuggestions)

  /* get ids from either the multiple-choice menu or from browser navigation */
  let result = await new Promise(async (resolve, reject) => {
    mcMenu.start().response().then(resolve)
    browserMonitor.post('/connect', async (req, res) => {
      /* wrap up and abort multiple-choice menu */
      res.end()
      mcMenu.stop()
      if (!req.body.url) reject(new Error('Request to /connect endpoint received with no params'))

      /* offer choice to use navigated url */
      const [, url] = req.body.url.match(/^https?:\/\/(.+?)\/?$/)
      term(prompt + '\n')
      term.up(1).column(prompt.length + 999)
      term.eraseDisplayBelow()
      term('\n')
      const yesNoPrompt = `  ^g^+›^: You just navigated to: ^_${url}^ \n    Do you want to select that experience?`
      const wantsToUseUrl = await yesOrNo(yesNoPrompt)
      if (wantsToUseUrl) {
        resolve(parseUrl(req.body.url))
      } else {
        term.up(3).column(1)
        term.eraseDisplayBelow()
        mcMenu.start()
      }
    })
  })

  /* clean up */
  await browserMonitor.stop()
  cleanTerminal()

  /* do we still need to get the experience? */
  if (_.isNumber(result)) {
    result = {
      propertyId: result,
      experienceId: await experience(result)
    }
  }

  /***/
  return result
}

async function getAutoCompleteMap ({arr, title, value}) {
  return arr.map((iteree) => ({
    title: iteree[title],
    value: iteree[value]
  }))
}

module.exports = {property, experience, both}
