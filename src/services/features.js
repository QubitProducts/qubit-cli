const fetch = require('../lib/fetch')

module.exports = {
  getPropertyFeatures: function getPropertyFeatures (propertyId) {
    return fetch.get(`/api/features/p/${propertyId}/features`)
  }
}
