import {
  infuraProjectId as infuraId,
  portisId,
  network
} from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'

const web3ModalTheme = {
  background: 'var(--background-body)',
  main: 'var(--font-color-heading)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--border-color)',
  hover: 'var(--background-highlight)'
}

// HEADS UP! We inline-require some packages so the Gatsby SSR build does not break.
// We only need them client-side.
const providerOptions =
  typeof window !== 'undefined'
    ? {
        walletconnect: {
          package: WalletConnectProvider,
          options: { infuraId }
        },
        portis: {
          package: require('@portis/web3'),
          options: {
            id: portisId
          }
        }
        // torus: {
        //   package: require('@toruslabs/torus-embed')
        //   // options: {
        //   //   networkParams: {
        //   //     host: oceanConfig.url, // optional
        //   //     chainId: 1337, // optional
        //   //     networkId: 1337 // optional
        //   //   }
        //   // }
        // }
      }
    : {}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

export function getNetworkId(network: string): number {
  switch (network) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
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
  if (!account) return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkName(networkId: number): string {
  switch (networkId) {
    case 1:
      return 'Main'
    case 3:
      return 'Ropsten'
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
