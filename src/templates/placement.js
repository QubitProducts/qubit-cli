const { restoreAll, onEvent, onEnterViewport } = require('@qubit/utils')()

module.exports = function renderPlacement ({
  content,
  elements,
  onImpression,
  onClickthrough,
  onRemove
}) {
  onRemove(restoreAll)
  if (content) {
  } else {
  }
}
// See https://docs.qubit.com/content/developers-placements/placement-overview for more info
