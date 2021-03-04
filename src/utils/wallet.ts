import { infuraProjectId as infuraId, portisId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'

export interface EthereumListsChain {
  name: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpc: string[]
  faucets: string[]
  infoURL: string
}

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

export function accountTruncate(account: string): string {
  if (!account) return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkDisplayName(
  data: EthereumListsChain,
  networkId: number
): string {
  const displayName = data
    ? `${data.chain} ${data.network === 'mainnet' ? '' : data.network}`
    : networkId === 8996
    ? 'Development'
    : 'Unknown'

  return displayName
}

export function getNetworkData(
  data: { node: EthereumListsChain }[],
  networkId: number
): EthereumListsChain {
  const networkData = data.filter(
    ({ node }: { node: EthereumListsChain }) => node.networkId === networkId
  )[0]
  return networkData.node
}
