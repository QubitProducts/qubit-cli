const _ = require('slapdash')
const fetch = require('./fetch')
const suggest = require('./suggest')
const getPkg = require('./get-pkg')
const FormData = require('form-data')
var fs = require('fs')

module.exports = async function uploadImages (files) {
  if (!Array.isArray(files)) throw new Error(`uploadImages expects at least one image to be passed`)
  const pkg = await getPkg()
  let propertyId = _.get(pkg, 'meta.propertyId')
  if (!propertyId) propertyId = await suggest.property()
  const fileUrls = files.map(file => {
    const data = new FormData()
    data.append(`image[file]`, fs.createReadStream(file))
    return fetch.post(`/p/${propertyId}/assets/images`, data, {
      headers: data.getHeaders()
    })
  })
  return Promise.all(fileUrls)
}
