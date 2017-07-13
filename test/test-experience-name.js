const experienceName = require('../src/lib/experience-filename')
const { expect } = require('chai')

describe('experience name', function () {
  it('should return names in the correct format', function () {
    expect(experienceName({ name: 'T096 - Geo-targeted airport services', id: 101125 }))
      .to.eql('t096-geo-targeted-airport-services-101125')

    expect(experienceName({ name: 'UK Merch - Summer 2018 SRP Banner', id: 100450 }))
      .to.eql('uk-merch-summer-2018-srp-banner-100450')

    expect(experienceName({
      name: 'UK-Merch  Mobile [Page?] Tickets/dining options available notification on Disney hotels',
      id: 90668
    }))
      .to.eql('uk-merch-mobile-page-tickets-dining-options-available-notification-on-disney-hotels-90668')
  })
})
