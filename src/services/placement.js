const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const propertyService = require('./property')
const { query } = require('../lib/graphql')
const { fromFiles, toFiles } = require('../lib/placement-mapper')
const { PLACEMENT_JS, PLACEMENT_TEST_JS } = require('../constants')

async function getAll (propertyId) {
  const data = await query(
    `
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
  }`,
    { propertyId }
  )
  return _.get(data, 'property.atom.placements', []).filter(
    p => _.get(p, 'draftImplementation.type') === 'CODE_INJECTION'
  )
}

async function get (propertyId, placementId, implementationType = 'draft') {
  const data = await query(
    `
  query getPlacement ($propertyId: Int!, $placementId: ID!) {
    property(propertyId: $propertyId) {
      atom {
        placement(id: $placementId) {
          ${fields}
        }
      }
    }
  }`,
    { propertyId, placementId }
  )

  const placement = _.get(data, 'property.atom.placement')
  return normalisePlacement(propertyId, placement, implementationType)
}

async function set (propertyId, placementId, files) {
  const spec = fromFiles(files)
  const data = await query(
    `
    mutation UpdatePlacement($placementSpec: PlacementUpdate!) {
      updatePlacement(placementUpdate: $placementSpec) {
        ${fields}
      }
    }`,
    {
      placementSpec: {
        id: placementId,
        ...spec
      }
    }
  )
  return normalisePlacement(propertyId, _.get(data, 'updatePlacement'))
}

async function publish (propertyId, placementId) {
  const data = await query(
    `
    mutation PublishPlacement($id: ID!) {
      publishPlacement(id: $id) {
        ${fields}
      }
    }
    `,
    {
      id: placementId
    }
  )
  return normalisePlacement(propertyId, _.get(data, 'publishPlacement'))
}

async function unpublish (propertyId, placementId) {
  const data = await query(
    `
    mutation UnpublishPlacement($id: ID!) {
      unpublishPlacement(id: $id) {
        ${fields}
      }
    }
    `,
    {
      id: placementId
    }
  )
  return normalisePlacement(propertyId, _.get(data, 'unpublishPlacement'))
}

async function create (propertyId, placementSpec) {
  const data = await query(
    `
    mutation CreatePlacement($propertyId: Int!, $placementSpec: PlacementSpec!) {
      createPlacement(propertyId: $propertyId, placementSpec: $placementSpec) {
        ${fields}
      }
    }
    `,
    {
      placementSpec,
      propertyId
    }
  )

  return _.get(data, 'createPlacement.id')
}

async function tags (propertyId) {
  const data = await query(
    `
  query($propertyId: Int!) {
    property(propertyId: $propertyId) {
      propertyId
      atom {
        tags {
          id
          name
        }
      }
    }
  }`,
    { propertyId }
  )
  return _.get(data, 'property.atom.tags', [])
}

async function status (propertyId, placementId) {
  const data = await query(
    `
    query PlacementPublicationState($propertyId: Int!, $placementId: ID!) {
      property(propertyId: $propertyId) {
        atom {
          placement(id: $placementId) {
            publicationState
          }
        }
      }
    }
  `,
    {
      propertyId,
      placementId
    }
  )
  return _.get(data, 'property.atom.placement.publicationState')
}

module.exports = {
  getAll,
  get,
  set,
  publish,
  unpublish,
  status,
  create,
  tags,
  addHelpers
}

async function normalisePlacement (
  propertyId,
  placement,
  implementationType = 'draft'
) {
  const property = await propertyService.get(propertyId)
  const implementation = placement[`${implementationType}Implementation`]
  if (!implementation) return null
  const code = {
    js: PLACEMENT_JS,
    css: '',
    ...implementation.code
  }
  const packageJson =
    typeof code.packageJson === 'string'
      ? JSON.parse(code.packageJson)
      : code.packageJson
  code.packageJson = {
    name: `qubit-placement-${placement.id}`,
    version: '1.0.0',
    description: 'placement powered by qubit',
    ...packageJson,
    meta: {
      ..._.get(packageJson, 'meta', {}),
      propertyId,
      placementId: placement.id,
      implementationId: implementation.id,
      tags: placement.tags,
      personalisationType: placement.personalisationType,
      vertical: property.vertical,
      domains: property.domains,
      namespace: property.qp_namespace,
      trackingId: property.tracking_id,
      remoteUpdatedAt: implementation.updatedAt,
      triggers: implementation.triggers
    },
    dependencies: { ..._.get(packageJson, 'dependencies', {}) },
    devDependencies: { ..._.get(packageJson, 'devDependencies', {}) }
  }

  return code ? toFiles(code, placement.schema.samplePayload) : null
}

async function addHelpers (files) {
  return {
    ...files,
    'placement.test.js': String(
      await fs.readFile(path.join(__dirname, '../placementTestTemplate.js'))
    )
  }
}

const fields = `
id
name
personalisationType
tags {
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
