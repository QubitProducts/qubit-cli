const _ = require('lodash')
const fetch = require('./fetch')

module.exports = { query }

async function query (q, variables = {}) {
  try {
    const response = await fetch.post('/graphql', {
      query: q,
      variables
    })
    handleResponseErrors(response)
    return response.data
  } catch (e) {
    handleResponseErrors(_.get(e, 'originalError.response.data'))
    throw e
  }
}

function handleResponseErrors (response = {}) {
  if (response.errors) {
    const messages = response.errors.map(e => e.message).join(', ')
    const error = new Error(`GraphQL error: ${messages}`)
    error.errors = response.errors
    throw error
  }
}
