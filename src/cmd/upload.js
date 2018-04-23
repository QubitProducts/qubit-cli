const uploadImages = require('../lib/upload-images')
const log = require('../lib/log')

module.exports = async function getImageURLs (files) {
  const images = await uploadImages(files)
  return images.map(({url}) => log.info(url))
}
