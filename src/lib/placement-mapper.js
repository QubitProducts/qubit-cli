module.exports = { toFiles, fromFiles }

function toFiles (code) {
  return {
    'placement.js': code.js,
    'placement.css': code.css,
    'package.json': JSON.stringify(code.packageJson, null, 2)
  }
}

function fromFiles (files) {
  return {
    js: files['placement.js'],
    css: files['placement.css'],
    packageJson: JSON.parse(files['package.json'])
  }
}
