function execution (options) {
  options.log.info('Hello from varaition')
  return {
    remove: () => options.log.info('Cleaning up varaition')
  }
}
