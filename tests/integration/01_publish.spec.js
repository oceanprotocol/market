/// <reference types="Cypress" />
describe('Publish', () => {
  beforeEach(() => {
    cy.visit('/publish')

    cy.get('main header p', { timeout: 60000 }).should(
      'contain',
      'Highlight the important features'
    )
  })

  it('should publish a data set with all fields', () => {
    // Add title
    cy.get('#name').type('Ocean Market Integration Test')
    // Add description
    cy.get('#description').type('Ocean Market Integration Test')
    // Add url of file
    cy.get('#files').type('https://oceanprotocol.com/tech-whitepaper.pdf')
    cy.get('#files + button').click()
    // Add url of sample
    cy.get('#links').type('https://oceanprotocol.com/tech-whitepaper.pdf')
    cy.get('#links + button').click()
    // Access
    cy.get('#access').select('Download')
    // Author
    cy.get('#author').type('Jelly McJellyfish')
    // Tags
    cy.get('#tags').type('fish, ocean, squid')
    // Terms
    cy.get('#i-agree-to-these-terms-and-conditions').click()

    // Start publish process
    cy.get('footer button').contains('Submit').should('not.be.disabled').click()

    // Wait for finish
    // cy.contains('Your asset is published!', {
    //   timeout: 12000
    // }).should('be.visible')

    // // Store DID for other tests to pick up
    // cy.get('a')
    //   .contains('See published asset')
    //   .invoke('attr', 'href')
    //   .then((href) => {
    //     cy.writeFile('cypress/fixtures/did.txt', href.replace('/asset/', ''))
    //   })
  })
})
