module.exports = function createEmitMetric (uv, meta, logger) {
  return function createEmitMetric (type, productId, metadata) {
    logger.info('Emitting metric: ' + type)
    uv.emit('qubit.metric', {
      type: type,
      experienceId: meta.experimentId,
      iterationId: meta.iterationId,
      variationId: meta.variationId,
      variationMasterId: meta.variationMasterId,
      productId: productId,
      metadata: metadata
        ? typeof metadata === 'string'
            ? metadata
            : JSON.stringify(metadata)
        : metadata
    })
  }
}
