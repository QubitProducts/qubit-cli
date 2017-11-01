const path = require('path')
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
process.env.NODE_CONFIG_DIR = path.resolve(__dirname)
module.exports = require('config')
