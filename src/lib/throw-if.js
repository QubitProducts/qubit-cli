const _ = require('lodash')
const getPkg = require('./get-pkg')
const PRE = 'pre'
const EXPERIENCE = 'experience'
const PLACEMENT = 'placement'

module.exports = {
  experience: throwIf(EXPERIENCE),
  pre: throwIf(PRE),
  placement: throwIf(PLACEMENT),
  none: throwIf()
}

async function getType () {
  const pkg = await getPkg()
  if (_.get(pkg, 'meta.experienceId')) return EXPERIENCE
  if (_.get(pkg, 'meta.placementId')) return PLACEMENT
  if (_.get(pkg, 'meta.isPreScript')) return PRE
}

function prefixCommand (type, cmd) {
  if (type === EXPERIENCE) return `qubit ${cmd}`
  return `qubit ${type} ${cmd}`
}

function throwIf (requiredType) {
  return async (suggestedCommand) => {
    const type = await getType()
    if (type !== requiredType) {
      let message
      if (type && !requiredType) {
        message = `You cannot run this command from a ${an(type)} directory`
      } else {
        message = `This command requires that you are in ${an(requiredType)} directory`
        if (type && suggestedCommand) {
          message += `. You probably meant to use \`${prefixCommand(type, suggestedCommand)}\``
        }
      }
      if (message) {
        throw new Error(message)
      }
    }
  }
}

function an (word) {
  if (/^[aeiou]/i.test(word)) {
    return `an ${word}`
  }
  return `a ${word}`
}
