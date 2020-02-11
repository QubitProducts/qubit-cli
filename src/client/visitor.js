const now = require('now-plus')

module.exports = () => ({
  area: 'By the bike shed',
  areaCode: '90210',
  city: 'Craggy Island',
  cityCode: '61206',
  conversionCycleNumber: 1,
  conversionNumber: 0,
  cookiePersists: true,
  country: 'Narnia',
  countryCode: 'GB',
  entranceNumber: 4,
  entranceTs: +now.minus(1, 'hour'),
  entranceViewNumber: 1,
  eventNumber: 1,
  firstViewTs: +now.minus(1, 'day'),
  ipAddress: '127.0.0.1',
  latitude: 20,
  lifetimeValue: 0,
  longitude: 20,
  pageViewNumber: 1,
  region: 'Slough',
  regionCode: '90210',
  sample: 61328,
  sessionNumber: 4,
  sessionTs: +now.minus(1, 'hour'),
  sessionViewNumber: 1,
  timezoneOffset: 0,
  viewNumber: 1,
  viewTs: +now(),
  visitorId: `chickpea-mcgee-${String(Math.random()).substr(2)}`
})
