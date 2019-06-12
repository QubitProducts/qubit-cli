module.exports = function createEmitCustomGoal (uv, meta) {
  return function emitCustomGoal (goalType, goal, goalAmount, transactionId) {
    // uv.emit('qubit.goalAchieved', {
    //   goalId: goal.goalId,
    //   experienceId: meta.experimentId,
    //   variationMasterId: meta.variationMasterId,
    //   iterationId: meta.iterationId,
    //   isControl: meta.variationIsControl,
    //   goalType: goalType,
    //   goalAmount: goalAmount,
    //   transactionId: transactionId
    // })
  }
}
