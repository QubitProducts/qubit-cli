module.exports = function (experience) {
  return experience.name.toLowerCase().replace(/[^\w]/g, '-').replace(/-+/g, '-')
}
