module.exports = function formatTemplates (templates) {
  const defaultNoTemplate = [{
    name: `   No template`,
    value: null
  }]
  return defaultNoTemplate.concat(templates.map(({ id, name }) => {
    return {
      name: '   ' + name,
      value: id
    }
  }))
}
