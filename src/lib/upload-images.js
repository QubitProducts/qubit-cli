const fetch = require('./fetch')
const suggest = require('./suggest')
const FormData = require('form-data')
var fs = require('fs')

module.exports = async function uploadImages (files) {
  if (!Array.isArray(files)) throw new Error(`uploadImages expects at least one image to be passed`)
  const propertyId = await suggest.property()
  const fileUrls = files.map(file => {
    const data = new FormData()
    data.append(`image[file]`, fs.createReadStream(file))
    return fetch.post(`/p/${propertyId}/assets/images`, data, {
      headers: data.getHeaders()
    })
  })
  return Promise.all(fileUrls)
}
