const _ = require('slapdash')

module.exports = function createEmitCustomGoal (uv, meta, goals, logger) {
  return function emitCustomGoal (name) {
    const goal = getGoal(goals || [], name)
    if (goals && !goal) {
      return logger.warn('You are not tracking the ' + name + 'custom event')
    }
    logger.info('Emitting custom goal: ' + name)
    uv.emit('qubit.goalAchieved', {
      goalId: goal ? goal.goalId : 'goalId',
      experienceId: meta.experimentId,
      variationMasterId: meta.variationMasterId,
      iterationId: meta.iterationId,
      isControl: meta.variationIsControl,
      goalType: 'other'
    })
  }
}

function getGoal (goals, name) {
  return _.find(goals, function (goal) {
    if (goal.key === 'pageviews.customvalues.uv.events.action' && goal.value) {
      return _.some(_.isArray(goal.value) ? goal.value : [], function (value) {
        return value === name
      })
    }
  })
}
