import { infuraProjectId, network } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
// import Torus from '@toruslabs/torus-embed'

const web3ModalTheme = {
  background: 'var(--brand-white)',
  main: 'var(--brand-black)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--brand-grey-lighter)',
  hover: 'var(--brand-grey-dimmed)'
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuraProjectId
    }
  }
  // torus: {
  //   package: Torus,
  //   options: {
  //     networkParams: {
  //       // host: oceanConfig.url // optional
  //       // chainId: 1337, // optional
  //       // networkId: 1337 // optional
  //     }
  //   }
  // }
}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

export function getNetworkId(network: string): number {
  switch (network) {
    case 'mainnet':
      return 1
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    case 'development':
      return 8996
    default:
      return 0
  }
}

export function isDefaultNetwork(networkId: number): boolean {
  const configuredNetwork = getNetworkId(network)
  return configuredNetwork === networkId
}

export function accountTruncate(account: string): string {
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkName(networkId: number): string {
  switch (networkId) {
    case 1:
      return 'Main'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    case 8996:
      return 'Development'
    default:
      return 'Unknown'
  }
}
