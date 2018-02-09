const path = require('path')
const fs = require('fs-extra')
const CWD = process.cwd()

module.exports = function loader (content, { file }) {
  let callback = this.async()
  getFiles().then(files => {
    content = content.replace(/.+\*\//, '')
    content = content.replace('__FILES__', `[${files.join(',')}]`)
    callback(null, content)
  })
}

async function getFiles () {
  return (await fs.readdir(CWD)).filter(f => /\.(js|css|json)$/.test(f)).map(f => `require.resolve('${path.join(CWD, f)}')`)
}
