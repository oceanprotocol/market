import loadable from '@loadable/component'
import { appConfig } from '../../app.config'

const { infuraProjectId, network, oceanConfig } = appConfig

const web3ModalTheme = {
  background: 'var(--brand-white)',
  main: 'var(--brand-black)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--brand-grey-lighter)',
  hover: 'var(--brand-grey-dimmed)'
}

const WalletConnectProvider = loadable(() =>
  import('@walletconnect/web3-provider')
)
const Torus = loadable(() => import('@toruslabs/torus-embed'))

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuraProjectId
    }
  },
  torus: {
    package: Torus,
    options: {
      networkParams: {
        host: oceanConfig.url // optional
        // chainId: 1337, // optional
        // networkId: 1337 // optional
      }
    }
  }
}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

export function isCorrectNetwork(chainId: number): boolean {
  const configuredNetwork = getChainId(network)
  return configuredNetwork === chainId
}

export function accountTruncate(account: string): string {
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'Main'
    case 4:
      return 'Rinkeby'
    case 42:
      return 'Kovan'
    default:
      return 'Unknown'
  }
}

export function getChainId(network: string): number {
  switch (network) {
    case 'mainnet':
      return 1
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}
