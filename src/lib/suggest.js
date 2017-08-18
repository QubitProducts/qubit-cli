const _ = require('lodash')
const propertyService = require('../services/property')
const experienceService = require('../services/experience')
const parseUrl = require('./parse-url')
const createApp = require('../server/app')
const term = require('terminal-kit').terminal

const {min, max} = Math

// Some convenience functions for the terminal

function cleanTerminal () {
  term.hideCursor(false)
  term.styleReset()
  term.grabInput(false)
}

const getCursorLocation = () => new Promise((resolve, reject) => {
  term.getCursorLocation((err, x, y) => {
    if (err) reject(err)
    else resolve({x, y})
  })
})

const yesOrNo = () => new Promise((resolve, reject) => {
  term(' ^b^+(y/n)^: ')
  term.yesOrNo((err, answer) => {
    term('\n')
    if (err) reject(err)
    else resolve(answer)
  })
})

/**
 * Start a new auto-complete picker that can be aborted.
 * @param {string} prompt
 * @param {Array.<{title: string, value: *}>} suggestions
 * @param {string} initialSubstring
 * @returns {{abort: (function()), getCurrentSubString: (function(): string), promise: Promise.<*>}}
 */
const createAutoComplete = (prompt, suggestions, initialSubstring = '') => {
  let abortFn = _.noop
  let subStr = initialSubstring
  const promise = new Promise(async (resolve, reject) => {
    try {
      term.saveCursor()
      term.hideCursor(true)

      // when the typed substring changes, the loop enters its next
      // iteration to re-render the menu, until an answer is given
      // eslint-disable-next-line no-undef-init
      let answer = undefined
      while (_.isUndefined(answer)) {
        // print the prompt to the terminal
        term.restoreCursor()
        term.eraseDisplayBelow()
        term(`${prompt}: ^_${subStr}^`)

        // figure out terminal spacing for the menu
        const cursorPos = await getCursorLocation()
        const spaceAvailable = term.height - cursorPos.y - 1
        if (spaceAvailable < 5) {
          term.scrollUp(5 - spaceAvailable)
          term.up(5 - spaceAvailable)
        }
        const menuHeight = min(10, max(5, spaceAvailable))

        // filter and limit the candidates
        const candidates = suggestions.filter(({title}) => new RegExp(subStr, 'i').test(title)).slice(0, menuHeight)

        // don't allow an empty candidate list
        if (candidates.length === 0) {
          subStr = subStr.slice(0, -1)
          continue
        }

        // prepare for the auto-complete menu
        const titles = candidates.map(c => c.title)
        const itemStyle = {
          noFormat: (str) => {
            term(str.replace(new RegExp(`(${subStr})`, 'i'), `^_$1^:`))
          }
        }

        // start the auto-complete menu
        answer = await new Promise((resolve, reject) => {
          const menu = term.singleColumnMenu(titles, {
            style: itemStyle,
            selectedStyle: itemStyle,
            selectedLeftPadding: '  ^b▶^ ',
            leftPadding: '    ',
            submittedLeftPadding: '    '
          }, (err, {submitted, selectedIndex}) => {
            if (err) {
              reject(err)
            } else if (submitted) {
              resolve(candidates[selectedIndex].value)
            }
          })
          const onKey = (name, matches, data) => {
            if (data.isCharacter) {
              subStr += name
              abortFn()
              resolve()
            } else if (name === 'BACKSPACE') {
              subStr = subStr.slice(0, -1)
              abortFn()
              resolve()
            } else if (name === 'ESCAPE') {
              abortFn()
              resolve(null)
            }
          }
          term.on('key', onKey)
          abortFn = () => {
            term.off('key', onKey)
            menu.abort()
          }
        })
      }
      term.restoreCursor()
      term.eraseDisplayBelow()
      cleanTerminal()
      resolve(answer)
    } catch (err) {
      reject(err)
    }
  })
  return {
    abort: () => { abortFn() },
    getCurrentSubString: () => subStr,
    promise
  }
}

async function property () {
  const suggestions = await getAutoCompleteMap({
    arr: await propertyService.get(),
    title: 'name',
    value: 'id'
  })
  if (suggestions.length === 1) {
    return suggestions[0].id
  }
  return await createAutoComplete('^g^+»^: Select a property (start typing to filter the list)', suggestions).promise
}

async function experience (propertyId) {
  const suggestions = await getAutoCompleteMap({
    arr: await experienceService.getAll(propertyId),
    title: 'name',
    value: 'id'
  })
  return createAutoComplete('^g^+»^: Select an experience (start typing to filter the list)', suggestions).promise
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
    let ac = createAutoComplete(prompt, propertySuggestions)
    ac.promise.then(resolve)

    // monitor browser navigation
    app.post('/connect', async (req, res) => {
      // wrap up and abort auto-complete
      res.end()
      if (!req.body.url) reject(new Error('request to /connect endpoint received with no params'))
      ac.abort()

      // offer choice to use navigated url
      const [, url] = req.body.url.match(/^https?:\/\/(.+?)\/?$/)
      term.up(1).column(prompt.length + 5 + ac.getCurrentSubString().length)
      term.eraseDisplayBelow()
      term(`\n  ^g^+›^: You just navigated to: ^_${url}^ \n    Do you want to select that experience?`)
      if (await yesOrNo()) {
        // use navigated url
        resolve(parseUrl(req.body.url))
      } else {
        // restart auto-complete picker
        term.up(3).column(1)
        term.eraseDisplayBelow()
        ac = createAutoComplete(prompt, propertySuggestions, ac.getCurrentSubString())
        ac.promise.then(resolve)
      }
    })
  })

  // clean up
  cleanTerminal()
  await app.stop()

  // do we still need to get the experience?
  if (_.isNumber(result)) {
    result = {
      propertyId: result,
      experienceId: await experience(result)
    }
  }

  return result
}

async function getAutoCompleteMap (data) {
  return data.arr.map((iteree) => {
    return {
      title: iteree[data.title],
      value: iteree[data.value]
    }
  })
}

module.exports = {property, experience, both}
