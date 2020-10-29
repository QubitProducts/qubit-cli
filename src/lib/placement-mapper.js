module.exports = { toFiles, fromFiles }

function toFiles (code, samplePayload) {
  return {
    'payload.json': JSON.stringify(samplePayload, null, 2),
    'placement.js': code.js,
    'placement.css': code.css,
    'package.json': JSON.stringify(code.packageJson, null, 2)
  }
}

function fromFiles (files) {
  return {
    schema: {
      samplePayload: JSON.parse(files['payload.json'])
    },
    code: {
      js: files['placement.js'],
      css: files['placement.css'],
      packageJson: JSON.parse(files['package.json'])
    }
  }
}
