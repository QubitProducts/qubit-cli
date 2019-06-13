const { query } = require('../lib/graphql')

const REVISION_FIELDS = [
  'id',
  'revisionId',
  'code',
  'packageJson',
  'updatedAt'
]

async function get (propertyId, revisionType = 'draft') {
  const data = await query(`
  query getPreScript ($propertyId: Int) {
    property(propertyId: $propertyId) {
      preScript {
        ${revisionType}Revision {
          ${REVISION_FIELDS.join('\n')}
        }
      }
    }
  }`, { propertyId })
  const revision = data.property.preScript[`${revisionType}Revision`]
  if (!revision) {
    throw new Error('This feature is not enabled for this property')
  }
  return normalizePkg(propertyId, revision)
}

async function set (propertyId, files) {
  const variables = {
    propertyId,
    code: files['pre.js'],
    packageJson: files['package.json']
  }
  const data = await query(`
  mutation updatePreScript ($propertyId: Int!, $code: String!, $packageJson: JSON!) {
    updatePropertyPreScript(
      propertyId: $propertyId
      code: $code
      packageJson: $packageJson
    ) {
      ${REVISION_FIELDS.join('\n')}
    }
  }`, variables)
  return normalizePkg(propertyId, data.updatePropertyPreScript)
}

async function publish (propertyId, changelog) {
  const data = await query(`
  mutation publishPreScript ($propertyId: Int!, $changelog: String!) {
    publishPropertyPreScript(
      propertyId: $propertyId
      changelog: $changelog
    ) {
      ${REVISION_FIELDS.join('\n')}
    }
  }`, { propertyId, changelog })
  return normalizePkg(propertyId, data.publishPropertyPreScript)
}

async function revisions (propertyId) {
  const data = await query(`
  query getPreScriptRevisions ($propertyId: Int) {
    property(propertyId: $propertyId) {
      preScript {
        revisions {
          ${REVISION_FIELDS.join('\n')}
          changelog
          publishedAt
          updatedAt
          updatedBy {
            email
          }
          publishedBy {
            email
          }
        }
      }
    }
  }`, { propertyId })
  return data.property.preScript.revisions.map(revision => (
    normalizePkg(propertyId, revision)
  ))
}

module.exports = { get, set, publish, revisions }

function normalizePkg (propertyId, revision) {
  revision.packageJson = {
    version: '1.0.0',
    dependencies: {},
    ...revision.packageJson,
    name: `qubit-pre-${propertyId}`,
    description: 'This script runs before all experiences and data collection. For more info see <docs site>.',
    meta: {
      ...revision.packageJson.meta,
      isPreScript: true,
      propertyId,
      remoteUpdatedAt: revision.updatedAt
    }
  }
  return revision
}
