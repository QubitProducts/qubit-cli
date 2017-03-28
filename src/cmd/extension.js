const path = require('path')
const opn = require('opn')
const pathname = path.resolve(__dirname, '../../chrome-extension')

module.exports = () => opn(pathname, { wait: false })
