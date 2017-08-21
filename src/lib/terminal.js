const _ = require('lodash')
const term = require('terminal-kit').terminal
const {min, max} = Math

async function cleanTerminal () {
  term.grabInput(false)
  term.hideCursor(false)
  term.styleReset()
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
 * @param {Array.<{name: string, value: *}>} suggestions
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
        const menuHeight = min(10, max(2, spaceAvailable))

        // filter and limit the candidates
        const candidates = suggestions
          .filter(({title}) => new RegExp(subStr, 'i').test(title))
          .slice(0, menuHeight)

        // don't allow an empty candidate list
        if (candidates.length === 0) {
          subStr = subStr.slice(0, -1)
          continue
        }

        // prepare for the auto-complete menu
        term.grabInput({ mouse: 'motion' })
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
      term.restoreCursor()
      term.eraseDisplayBelow()
      term(`${prompt}: ^b^+${answer ? answer.title : ''}^\n`)
      cleanTerminal()
      resolve(answer && answer.value)
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

module.exports = {
  cleanTerminal,
  getCursorLocation,
  yesOrNo,
  createAutoComplete,
  term
}
