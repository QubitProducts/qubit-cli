const fetch = require('./fetch')
const FormData = require('form-data')
var fs = require('fs')

module.exports = async function uploadImages (files) {
  if (!Array.isArray(files)) throw new Error(`uploadImages expects an array`)
  const fileUrls = files.map(file => {
    const data = new FormData()
    data.append(`image[file]`, fs.createReadStream(file))
    return fetch.post(`/p/2500/images`, data, {
      headers: data.getHeaders()
    })
  })
  return Promise.all(fileUrls)
}
