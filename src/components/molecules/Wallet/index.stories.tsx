import React from 'react'
import Web3Feedback from '../Web3Feedback'
import web3Mock from '../../../../tests/unit/__mocks__/web3'
import { Center } from '../../../../.storybook/helpers'

export default {
  title: 'Molecules/Web3Feedback',
  decorators: [(storyFn: any) => <Center>{storyFn()}</Center>]
}

// export const NoWeb3Browser = () => {
//   const mock = {
//     web3: null
//   } as any

//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }

// export const NoAccountConnected = () => {
//   const mock = {
//     ethProviderStatus: 0,
//     account: ''
//   }
//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }

// export const NotConnectedToPacific = () => {
//   const mock = {
//     ethProviderStatus: 1,
//     account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
//     balance: '11223.748267896',
//     web3: {
//       ...web3Mock,
//       eth: {
//         ...web3Mock.eth,
//         getChainId: () => Promise.resolve(1)
//       }
//     }
//   }

//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }

// export const ErrorConnectingToOcean = () => {
//   const mock = {
//     ethProviderStatus: 1,
//     account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
//     balance: '11223.748267896',
//     web3: {
//       ...web3Mock,
//       eth: {
//         ...web3Mock.eth,
//         getChainId: () => Promise.resolve(1)
//       }
//     }
//   }
//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }

// export const ErrorInssuficientBalance = () => {
//   const mock = {
//     ethProviderStatus: 1,
//     account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
//     balance: '11223.748267896'
//   }
//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }

// export const ConnectedToOcean = () => {
//   const mock = {
//     ethProviderStatus: 1,
//     account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
//     balance: '11223.748267896'
//   }
//   return (
//     <context.Provider value={mock}>
//       <Web3Feedback />
//     </context.Provider>
//   )
// }
