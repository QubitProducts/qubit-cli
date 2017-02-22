const path = require('path')
const opn = require('opn')

module.exports = () => opn(`${path.dirname(__dirname)}`, { wait: false })
