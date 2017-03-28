const goalNames = [
  { value: 'metrics.conversions_per_visitor', name: 'Conversions per visitor' },
  { value: 'metrics.revenue_per_visitor', name: 'Revenue per visitor' },
  { value: 'metrics.revenue_per_converter', name: 'Revenue per converter' },
  { value: 'pageviews.url', name: 'Page URL' },
  { value: 'pageviews.customvalues.uv.events.action', name: 'Event action (UV)' }
]

const operators = [
  { value: 'in', name: 'contains' },
  { value: 'regex', name: 'matches regex' }
]

function read (goals) {
  return goals.map((goal) => {
    const goalName = getGoalName(goal)
    const operator = getOperatorName(goal)
    const value = (goal.value || []).join(' OR ')
    const primary = goal.primary ? '(Primary goal)' : ''

    return {
      value: goal.id,
      name: `${goalName} ${operator} ${value} ${primary}`,
      disabled: goal.primary
    }
  })
}

function add (goals, goalToAdd) {
  goals.push(goalToAdd)
  return goals
}

function remove (goals, goalToRemove) {
  return goals.filter((goal) => goal.id !== goalToRemove)
}

function setPrimary (goals, goalToMakePrimary) {
  goals.forEach((goal) => {
    if (goal.primary) goal.primary = false
    if (goal.id === goalToMakePrimary) goal.primary = true
  })

  return goals
}

function getGoalName (goal) {
  return goalNames.filter((goalName) => goalName.value === goal.key)[0].name
}

function getOperatorName (goal) {
  const operator = operators.filter((operator) => operator.value === goal.op)
  return operator.length ? operator[0].name : ''
}

module.exports = { goalNames, operators, read, add, remove, setPrimary }
