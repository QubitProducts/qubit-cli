module.exports = {
  'global.js': 'console.log("global code")',
  'package.json': JSON.stringify(require('./pkg'), null, 2),
  'triggers.js': 'console.log("triggers")',
  'variation-336711.css': 'a {\n color: green \n}',
  'variation-336711.js': 'function () { console.log("variation 2") }',
  'variation-49937.css': 'a {\n color: purple; \n}',
  'variation-49937.js': 'function () { console.log("variation 1") }'
}
