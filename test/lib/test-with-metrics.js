const { expect } = require('chai')
const withMetrics = require('../../src/lib/withMetrics')
const experienceFixture = require('../fixtures//experience.json')

describe('withMetrics', function () {
  it('should add metrics to experience.meta', function () {
    
  })
})

/*
experience:
{ name: 'Created by xp',
  propertyId: null,
  editor_version: 3,
  recent_iterations: { draft: { variations: [Object] } },
  solution_id: 6 }

withMetrics(experience, {created: true}):
{ name: 'Created by xp',
  propertyId: null,
  editor_version: 3,
  recent_iterations: { draft: { variations: [Object] } },
  solution_id: 6,
  meta: '{"xp":{"pushes":1,"version":"1.12.0","created":true,"lastPush":"2017-03-10T17:11:12.274Z"}}' }
*/
