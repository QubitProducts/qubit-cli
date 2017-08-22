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
 * An interactive menu on the terminal for users
 * to choose one ofc a set of given options.
 */
class MultipleChoiceMenu {
  /**
   * @param {String} prompt - the opening message presented to the user
   * @param {Array.<{title:String,value:*}>} candidates - the available options
   */
  constructor (prompt, candidates) {
    this.prompt = prompt
    this.candidates = candidates
    this._abort = _.noop
    this.subStr = ''
    this._deferred = defer()
  }

  /**
   * Start the menu and wait for user input. The menu
   * can still be interrupted by calling `.stop()`.
   * @returns {MultipleChoiceMenu} this menu object
   */
  start () {
    (async () => {
      try {
        term.saveCursor()
        term.hideCursor(true)

        // terminal-kit's `singleColumnMenu` doesn't support find-as-you-type,
        // so we're implementing that here, by re-rendering the menu
        // when the typed substring changes. That causes the `renderSingleMenu`
        // promise to resolve, and the loop to enter its next iteration.
        let answer
        do {
          // figure out terminal spacing for the menu
          const cursorPos = await getCursorLocation()
          const spaceAvailable = term.height - cursorPos.y
          const menuHeight = min(10, max(2, spaceAvailable))

          // filter and limit the candidates
          const visibleCandidates = this.candidates
            .filter(({title}) => new RegExp(this.subStr, 'i').test(title))
            .slice(0, menuHeight)

          // don't allow an empty candidate list
          if (visibleCandidates.length > 0) {
            // print the prompt to the terminal
            term.eraseDisplayBelow()
            term(`${this.prompt}: ^_${this.subStr}^`)
            answer = await this._renderSingle(visibleCandidates)
          } else {
            this.subStr = this.subStr.slice(0, -1)
          }
        } while (_.isUndefined(answer))

        // The loop terminated, so we got an answer or an abort from the user.
        term.restoreCursor()
        term.eraseDisplayBelow()
        term(`${this.prompt}: ^b^+${answer ? answer.title : ''}^\n`)
        cleanTerminal()
        this._deferred.resolve(answer && answer.value)
      } catch (err) {
        this._deferred.reject(err)
      }
    })()
    return this
  }

  /**
   * Interrupt a running menu and take back control of the terminal.
   * The menu can be (re)started by calling `.start()`.
   * @returns {MultipleChoiceMenu} this menu object
   */
  stop () {
    this._abort()
    this._abort = _.noop
    return this
  }

  /**
   * @returns {Promise.<*>} a promise of the user's response
   */
  async response () {
    return this._deferred.promise
  }

  async _renderSingle (candidates) {
    const titles = candidates.map(c => c.title)
    const itemStyle = {
      noFormat: (str) => {
        term(str.replace(new RegExp(`(${this.subStr})`, 'i'), `^_$1^:`))
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
          this.subStr += name
          this._abort()
          resolve()
        } else if (name === 'BACKSPACE') {
          this.subStr = this.subStr.slice(0, -1)
          this._abort()
          resolve()
        } else if (name === 'ESCAPE') {
          this._abort()
          resolve(null)
        }
      }
      term.on('key', onKey)
      this._abort = () => {
        term.off('key', onKey)
        menu.abort()
        term.restoreCursor()
        term.eraseDisplayBelow()
      }
    })
  }
}

module.exports = {
  MultipleChoiceMenu,
  cleanTerminal,
  getCursorLocation,
  yesOrNo,
  term
}
