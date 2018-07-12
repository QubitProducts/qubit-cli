module.exports = function formatTemplates (templates) {
  return templates.map(({ id, name }) => {
    return {
      name: '   ' + name,
      value: id
    }
  })
}
