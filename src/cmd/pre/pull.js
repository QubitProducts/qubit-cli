const preService = require('../../services/pre')
const { getPropertyId } = require('../../lib/get-resource-ids')
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const log = require('../../lib/log')

const CWD = process.cwd()
const VALID_REVISIONS = ['live', 'draft']

module.exports = async function pull (propertyId, revisionType = 'draft') {
  if (VALID_REVISIONS.includes(propertyId)) {
    propertyId = null
    revisionType = propertyId
  }
  if (!VALID_REVISIONS.includes(revisionType)) {
    throw new Error(`'${revisionType}' is not a valid revision`)
  }
  const pkg = await getPkg()
  propertyId = await getPropertyId(propertyId, pkg)
  await throwIf.experience('qubit pull')
  const revision = await preService.get(propertyId, revisionType)
  const files = {
    'package.json': JSON.stringify(revision.packageJson, null, 2),
    'pre.js': revision.code
  }
  await scaffold(CWD, files, { removeExtraneous: true })
  log.info('Pre script pulled')
}
