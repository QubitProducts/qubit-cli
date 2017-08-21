const _ = require('lodash')
const term = require('terminal-kit').terminal
const defer = require('promise-defer')
const {min, max} = Math

/**
 * Undo most of terminal-kit's changes to the terminal.
 */
function cleanTerminal () {
  term.grabInput(false)
  term.hideCursor(false)
  term.styleReset()
}

/**
 * A `Promise`-based version of terminal-kit's `getCursorLocation`
 */
const getCursorLocation = () => new Promise((resolve, reject) => {
  term.getCursorLocation((err, x, y) => {
    if (err) reject(err)
    else resolve({x, y})
  })
})

/**
 * Ask the user a yes-or-no question.
 * @param  {string} prompt
 * @return {Promise.<boolean>}
 */
const yesOrNo = (prompt) => new Promise((resolve, reject) => {
  term(`${prompt} ^b^+(y/n)^: `)
  term.yesOrNo((err, answer) => {
    if (err) {
      reject(err)
    } else {
      term.up(1).column(0)
      term.eraseDisplayBelow()
      term(`${prompt} ^b^+(y/n)^: ^b^+${answer ? 'yes' : 'no'}^:\n`)
      resolve(answer)
    }
  })
})

/**
 * Start a new auto-complete picker that can be aborted and resumed.
 * @param {string} prompt
 * @param {Array.<{name: string, value: *}>} suggestions
 * @returns {{
 *     abort:    function(),
 *     resume:   function(),
 *     response: function(): Promise.<*>
 * }}
 */
const createAutoComplete = (prompt, suggestions) => {
  let abortFn = _.noop
  let subStr = ''

  // Render a single-column menu for a given set of candidates.
  // When the user cancels or makes a definite choice, this function
  // resolves with `null` or the response object respectively.
  // This function also responds to text-keystrokes by updating the
  // `subStr` variable and resolving with `undefined`.
  // (We can then call this function again with the new candidates.)
  // It also resets the `abortFn` function.
  function renderSingleMenu (candidates) {
    const titles = candidates.map(c => c.title)
    const itemStyle = {
      noFormat: (str) => {
        term(str.replace(new RegExp(`(${subStr})`, 'i'), `^_$1^:`))
      }
    }
    term.grabInput({mouse: 'motion'})
    return new Promise((resolve, reject) => {
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
          resolve(candidates[selectedIndex])
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
        term.restoreCursor()
        term.eraseDisplayBelow()
      }
    })
  }

  // This deferred contains the promise of the user's eventual answer.
  // We're using a deferred so that the promise will be valid across
  // multiple invocations of `startMenu`.
  const deferred = defer()
  async function startMenu () {
    try {
      term.saveCursor()
      term.hideCursor(true)

      // terminal-kit's `singleColumnMenu` doesn't support find-as-you-type,
      // so we're implementing that here, by re-rendering the menu
      // when the typed substring changes. That causes the `renderSingleMenu`
      // promise to resolve, and the loop to enter its next iteration.
      let answer
      do {
        // print the prompt to the terminal
        term.restoreCursor()
        term.eraseDisplayBelow()
        term(`${prompt}: ^_${subStr}^`)

        // figure out terminal spacing for the menu
        const cursorPos = await getCursorLocation()
        const spaceAvailable = term.height - cursorPos.y - 1
        const menuHeight = min(10, max(2, spaceAvailable))

        // filter and limit the candidates
        const candidates = suggestions
          .filter(({title}) => new RegExp(subStr, 'i').test(title))
          .slice(0, menuHeight)

        // don't allow an empty candidate list
        if (candidates.length > 0) {
          answer = await renderSingleMenu(candidates)
        } else {
          subStr = subStr.slice(0, -1)
        }
      } while (_.isUndefined(answer))

      // The loop terminated, so we got an answer or an abort from the user.
      term.restoreCursor()
      term.eraseDisplayBelow()
      term(`${prompt}: ^b^+${answer ? answer.title : ''}^\n`)
      cleanTerminal()
      deferred.resolve(answer && answer.value)
    } catch (err) {
      deferred.reject(err)
    }
  }

  // Start the menu for the first time.
  startMenu()

  // Return the functions to interact with the menu.
  return {
    abort: () => {
      abortFn()
      abortFn = _.noop
    },
    resume: () => {
      if (abortFn === _.noop) {
        startMenu()
      }
    },
    response: () => deferred.promise
  }
}

module.exports = {
  cleanTerminal,
  getCursorLocation,
  yesOrNo,
  createAutoComplete,
  term
}
