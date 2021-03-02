import { infuraProjectId as infuraId, portisId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import axios, { CancelToken } from 'axios'
import { Logger } from '@oceanprotocol/lib'

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

export async function getNetworkData(
  networkId: number,
  cancelToken: CancelToken
): Promise<any> {
  if (!networkId) return

  try {
    // https://github.com/ethereum-lists/chains
    const response = await axios('https://chainid.network/chains.json', {
      cancelToken
    })
    const network = response.data.filter(
      (item: { networkId: number }) => item.networkId === networkId
    )[0]

    return network
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(
        `Could not fetch from chainid.network/chains.json: ${error.message}`
      )
    }
  }
}

export async function getNetworkDisplayName(
  networkId: number,
  cancelToken: CancelToken
): Promise<string> {
  const network = await getNetworkData(networkId, cancelToken)

  const networkName = network
    ? `${network.chain} ${network.network}`
    : networkId === 8996
    ? 'Development'
    : 'Unknown'

  return networkName
}
