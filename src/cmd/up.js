require('colors')
const codeService = require('../services/code')
const log = require('../lib/log')
const readFiles = require('../lib/read-files')
const jsdiff = require('diff');
let CWD = process.cwd()

module.exports = async function up (propertyId, experienceId) {
  log('pushing...')
  const files = await codeService.get(propertyId, experienceId)
  const localFiles = await readFiles(CWD)
  const fileDiffs = checkDiff(localFiles, files)

  if (fileDiffs.length) {
  	for (let files of fileDiffs) {
  		const diff = jsdiff.diffChars(files.local, files.value)
  		diff.forEach(function(part){
			  // green for additions, red for deletions
			  // grey for common parts
			  var color = part.added ? 'green' :
			    part.removed ? 'red' : 'grey'
			  process.stderr.write(part.value[color])
			})
  	}
  } else {
  	await codeService.set(propertyId, experienceId, await readFiles(CWD))
  	log('pushed!')
  }
 

  function checkDiff (localFiles, files) {
  	let diffs = []
  	for (let name in files) {
	    if (files.hasOwnProperty(name)) {
	      const value = files[name]
	      const localValue = localFiles[name]
	      if (typeof value === 'string' && name !== 'package.json') {
	       const diff = value !== localValue

	       if (diff) { // If there is a diff then generate a diff output.
	       	diffs.push({local: localValue, remote: value})
	       }
	    }
  	}
  	return diffs
  }
}
