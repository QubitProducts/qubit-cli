const formatLog = require('./format-log')

const goalNames = [
  {
    value: 'metrics.conversions_per_visitor',
    name: formatLog('   Conversions per visitor'),
    exclusive: true
  },
  {
    value: 'metrics.revenue_per_visitor',
    name: formatLog('   Revenue per visitor'),
    exclusive: true
  },
  {
    value: 'metrics.revenue_per_converter',
    name: formatLog('   Revenue per converter'),
    exclusive: true
  },
  { value: 'pageviews.url', name: formatLog('   Page URL'), exclusive: false },
  {
    value: 'pageviews.customvalues.uv.events.action',
    name: formatLog('   Event action (UV)'),
    exclusive: false
  },
  {
    value: 'pageviews.customvalues.uv.page.category',
    name: formatLog('   Category event (UV)'),
    exclusive: false
  }
]

const operators = [
  { value: 'eq', name: 'equals' },
  { value: 'in', name: 'contains' },
  { value: 'regex', name: 'matches regex' }
]

function read (goals) {
  return goals.map(goal => {
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
  const newGoals = goals
  newGoals.push(goalToAdd)

  return newGoals
}

function remove (goals, goalToRemove) {
  return goals.filter(goal => goal.id !== goalToRemove)
}

function setPrimary (goals, goalToMakePrimary) {
  const newGoals = goals

  newGoals.forEach(goal => {
    if (goal.primary) goal.primary = false
    if (goal.id === goalToMakePrimary) goal.primary = true
  })

  return newGoals
}

function getGoalName (goal) {
  return goalNames.filter(goalName => goalName.value === goal.key)[0].name
}

function getOperatorName (goal) {
  const operator = operators.filter(operator => operator.value === goal.op)
  return operator.length ? operator[0].name : ''
}

module.exports = { goalNames, operators, read, add, remove, setPrimary }
