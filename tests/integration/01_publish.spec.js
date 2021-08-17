/* eslint-disable ui-testing/no-disabled-tests */
/* eslint-disable prettier/prettier */

/// <reference types="Cypress" />

import WalletConnectProvider from '@walletconnect/web3-provider'
import PrivateKeyProvider from 'truffle-privatekey-provider'

const HDWalletProvider = require('@truffle/hdwallet-provider')

const Web3 = require('web3')
// const bip39 = require('bip39')

describe('Publish', () => {
  beforeEach(() => {
    cy.visit('/publish')

    cy.window().then((win) => {
      const provider = new HDWalletProvider({
        mnemonic:
          'taxi music thumb unique chat sand crew more leg another off lamp',
        privateKeys: [
          '0xc594c6e5def4bab63ac29eed19a134c130388f74f019bc74b8f4389df2837a58'
        ],
        chainId: 1337,
        providerOrUrl: 'http://172.15.0.3:8545'
      })

      // const provider = new WalletConnectProvider({
      //     rpc: {
      //         1337: 'http://172.15.0.3:8545'
      //     }
      // });

      // provider.updateRpcUrl(1337, 'http://172.15.0.3:8545')

      win.ethereum = provider
      win.localStorage.setItem('WEB3_CONNECT_CACHED_PROVIDER', '"injected"')
    })

    // cy.get('main header p', { timeout: 60000 }).should(
    //     'contain',
    //     'Highlight the important features'
    // )
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
    cy.get('#Download').check({ force: true })
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
