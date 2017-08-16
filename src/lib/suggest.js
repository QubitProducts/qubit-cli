const autocomplete = require('cli-autocomplete')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')
const confirm = require('confirmer')
const highlight = require('./highlight')
const parseUrl = require('./parse-url')
const createApp = require('../server/app')
const term = require('terminal-kit').terminal

async function property (message) {
  const suggestions = await getAutocompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })

  return new Promise(function (resolve) {
    if (suggestions.length === 1) {
      resolve(suggestions[0].id)
    } else {
      autocomplete(message, (input) => {
        return filter(input, suggestions)
      }).on('submit', resolve)
    }
  })
}

async function experience (propertyId) {
  const suggestions = await getAutocompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })

  return new Promise(function (resolve) {
    autocomplete('Select an experience', (input) => {
      return filter(input, suggestions)
    }).on('submit', resolve)
  })
}

async function both () {
  const suggestions = await getAutocompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })

  term.saveCursor()

  // function to start a new auto-complete picker
  const newAC = () => {
    term.restoreCursor()
    term.eraseDisplayBelow()
    const msg = 'Select a property or navigate to an experience in your browser'
    const ac = autocomplete(msg, (input) => filter(input, suggestions))
    let manuallyAborted = false
    return {
      abort: () => {
        manuallyAborted = true
        ac.emit('abort')
        term.eraseDisplayBelow()
      },
      promise: new Promise((resolve) => {
        ac.on('submit', async (propertyId) => {
          resolve({
            propertyId,
            experienceId: await experience(propertyId)
          })
        })
        ac.on('abort', () => {
          if (!manuallyAborted) {
            resolve(null)
          }
        })
      })
    }
  }

  // start app to monitor browser navigation
  const app = await createApp()
  await app.start()

  // get ids from either the auto-complete picker or from browser navigation
  const result = await new Promise(async (resolve, reject) => {
    // start auto-complete picker
    let ac = newAC()
    ac.promise.then(resolve)

    // monitor browser navigation
    app.post('/connect', async (req, res) => {
      // wrap up and abort auto-complete
      res.end()
      if (!req.body.url) { reject(new Error('request to /connect endpoint received with no params')) }
      ac.abort()

      // offer choice to use navigated url
      const msg = `\nYou just navigated to ${highlight(req.body.url)}.` +
        `\nDo you want to select that experience? ${highlight('(y/n)')}`
      if (await confirm(msg)) {
        // use navigated url
        resolve(parseUrl(req.body.url))
      } else {
        // restart auto-complete picker
        ac = newAC()
        ac.promise.then(resolve)
      }
    })
  })

  await app.stop()

  return result
}

async function getAutocompleteMap (data) {
  return data.arr.map((iteree) => {
    return {
      title: iteree[data.title],
      value: iteree[data.value]
    }
  })
}

function filter (input, suggestions) {
  return Promise.resolve(suggestions.filter((suggestion) => {
    return suggestion.title.toLowerCase().includes(input.toLowerCase())
  }))
}

module.exports = {property, experience, both}
