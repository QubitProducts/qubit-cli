const path = require('path')
const fs = require('fs-extra')
const slash = require('slash')
const CWD = process.cwd()

module.exports = function loader (content, { file }) {
  const callback = this.async()
  getFiles().then(files => {
    content = content.replace(/.+\*\//, '')
    content = content.replace('__FILES__', `[${files.join(',')}]`)
    callback(null, content)
  })
}

async function getFiles () {
  const files = await fs.readdir(CWD)
  return files
    .filter(f => /\.(js|css|less|json)$/.test(f))
    .map(f => `require.resolve('${slash(path.join(CWD, f))}')`)
}
