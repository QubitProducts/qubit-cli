const preService = require('../../services/pre')
const { getPropertyId } = require('../../lib/get-resource-ids')
const getPkg = require('../../lib/get-pkg')
const scaffold = require('../../lib/scaffold')
const throwIf = require('../../lib/throw-if')
const isOneOf = require('../../lib/is-one-of')(['live', 'draft'])
const log = require('../../lib/log')

const CWD = process.cwd()
const VALID_REVISIONS = ['live', 'draft']

module.exports = async function pull (propertyId, revisionType = 'draft') {
  if (VALID_REVISIONS.includes(propertyId)) {
    propertyId = null
    revisionType = propertyId
  }
  await throwIf.pre('pull')
  isOneOf(revisionType)
  const pkg = await getPkg()
  propertyId = await getPropertyId(propertyId, pkg)
  const revision = await preService.get(propertyId, revisionType)
  const files = {
    'package.json': JSON.stringify(revision.packageJson, null, 2),
    'pre.js': revision.code
  }
  await scaffold(CWD, files, { removeExtraneous: true })
  log.info('Pre script pulled')
}
