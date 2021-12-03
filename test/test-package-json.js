const { expect } = require('chai')
const pkg = require('../package.json')

describe('package.json', () => {
  it('should not have any private packages in it', () => {
    const deps = Object.keys(pkg.dependencies)
    const msg = `
      We detected some @qubit / @qutics dependencies in your package.json.
      These can only be installed after logging in with qubit-cli and therefore
      need to be installed in a separate step. To enable this please run the following
      command:
      
      make create-install-private-packages


    `

    for (const dep of deps) {
      expect(dep.startsWith('@qubit')).to.eql(false, msg)
      expect(dep.startsWith('@qutics')).to.eql(false, msg)
    }
  })
})
