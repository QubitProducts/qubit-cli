const _ = require('lodash')
const propertyService = require('./property')
const { query } = require('../lib/graphql')
const { fromFiles, toFiles } = require('../lib/placement-mapper')

async function getAll (propertyId) {
  const data = await query(`
  query($propertyId: Int!) {
    property(propertyId: $propertyId) {
      propertyId
      atom {
        placements {
          id
          name
          draftImplementation {
            type
          }
        }
      }
    }
  }`, { propertyId })
  return _.get(data, 'property.atom.placements', [])
    .filter(p => _.get(p, 'draftImplementation.type') === 'CODE_INJECTION')
}

async function get (propertyId, placementId, implementationType = 'draft') {
  const data = await query(`
  query getPlacement ($propertyId: Int!, $placementId: ID!) {
    property(propertyId: $propertyId) {
      atom {
        placement(id: $placementId) {
          ${fields}
        }
      }
    }
  }`, { propertyId, placementId })

  const placement = _.get(data, 'property.atom.placement')
  return normalisePlacement(propertyId, placement, implementationType)
}

async function set (propertyId, placementId, files) {
  const spec = fromFiles(files)
  const data = await query(`
    mutation UpdatePlacement($placementSpec: PlacementUpdate!) {
      updatePlacement(placementUpdate: $placementSpec) {
        ${fields}
      }
    }`, {
    placementSpec: {
      id: placementId,
      ...spec
    }
  })
  return normalisePlacement(propertyId, _.get(data, 'updatePlacement'))
}

async function publish (propertyId, placementId) {
  const data = await query(`
    mutation PublishPlacement($id: ID!) {
      publishPlacement(id: $id) {
        ${fields}
      }
    }
    `, {
    id: placementId
  })
  return normalisePlacement(propertyId, _.get(data, 'publishPlacement'))
}

async function unpublish (propertyId, placementId) {
  const data = await query(`
    mutation UnpublishPlacement($id: ID!) {
      unpublishPlacement(id: $id) {
        ${fields}
      }
    }
    `, {
    id: placementId
  })
  return normalisePlacement(propertyId, _.get(data, 'unpublishPlacement'))
}

async function create (propertyId, placementSpec) {
  const data = await query(`
    mutation CreatePlacement($placementSpec: PlacementSpec!) {
      createPlacement(placementSpec: $placementSpec) {
        ${fields}
      }
    }
    `, {
    placementSpec
  })
  return normalisePlacement(propertyId, _.get(data, 'createPlacement'))
}

async function locations (propertyId) {
  const data = await query(`
  query($propertyId: Int!) {
    property(propertyId: $propertyId) {
      propertyId
      atom {
        locations {
          id
          name
        }
      }
    }
  }`, { propertyId })
  return _.get(data, 'property.atom.locations', [])
}

async function status (propertyId, placementId) {
  const data = await query(`
    query PlacementPublicationState($propertyId: Int!, $placementId: ID!) {
      property(propertyId: $propertyId) {
        atom {
          placement(id: $placementId) {
            publicationState
          }
        }
      }
    }
  `, {
    propertyId, placementId
  })
  return _.get(data, 'property.atom.placement.publicationState')
}

module.exports = { getAll, get, set, publish, unpublish, status, create, locations }

async function normalisePlacement (propertyId, placement, implementationType = 'draft') {
  const property = await propertyService.get(propertyId)
  const implementation = placement[`${implementationType}Implementation`]
  if (!implementation) return null

  const code = implementation.code
  const packageJson = typeof code.packageJson === 'string'
    ? JSON.parse(code.packageJson)
    : code.packageJson

  if (code) {
    code.packageJson = {
      name: `qubit-placement-${placement.id}`,
      version: '1.0.0',
      description: 'placement powered by qubit',
      ...packageJson,
      meta: {
        ...packageJson.meta,
        propertyId,
        placementId: placement.id,
        implementationId: implementation.id,
        locationId: placement.location.id,
        personalisationType: placement.personalisationType,
        vertical: property.vertical,
        domains: property.domains,
        namespace: property.qp_namespace,
        trackingId: property.trackingId,
        remoteUpdatedAt: implementation.updatedAt,
        triggers: implementation.triggers
      },
      dependencies: { ...code.packageJson.dependencies }
    }
  }

  return code
    ? toFiles(code, placement.schema.samplePayload)
    : null
}

const fields = `
id
name
personalisationType
location {
  id
}
schema {
  samplePayload
}
activeImplementation {
  id
  type
  code {
    js
    css
    packageJson
  }
  triggers
  updatedAt
}
draftImplementation {
  id
  type
  code {
    js
    css
    packageJson
  }
  triggers
  updatedAt
}`
