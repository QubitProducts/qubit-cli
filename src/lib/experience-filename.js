module.exports = function (experience) {
  const name = experience.name
    .toLowerCase()
    .replace(/[^\w]/g, '-')
    .replace(/-+/g, '-')

  return name + '-' + experience.id
}
