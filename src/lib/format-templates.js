module.exports = function formatTemplates (templates) {
  const defaultNoTemplate = [{
    name: `   Custom`,
    value: null
  }]
  return defaultNoTemplate.concat(templates.map(({ id, name }) => {
    return {
      name: '   ' + name,
      value: id
    }
  }))
}
