import { LoggerInstance } from '@oceanprotocol/lib'
import { createClient, erc20ABI } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  goerli,
  polygonMumbai,
  sepolia
} from 'wagmi/chains'
import { ethers, Contract, Signer } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { getDefaultClient } from 'connectkit'
import { getNetworkDisplayName } from '@hooks/useNetworkMetadata'
import { getOceanConfig } from '../ocean'

export async function getDummySigner(chainId: number): Promise<Signer> {
  if (typeof chainId !== 'number') {
    throw new Error('Chain ID must be a number')
  }

  // Get config from ocean lib
  const config = getOceanConfig(chainId)
  try {
    const privateKey =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const provider = new ethers.providers.JsonRpcProvider(config.nodeUri)
    return new ethers.Wallet(privateKey, provider)
  } catch (error) {
    throw new Error(`Failed to create dummy signer: ${error.message}`)
  }
}

// Wagmi client
export const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Ocean Market',
    infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    // TODO: mapping between appConfig.chainIdsSupported and wagmi chainId
    chains: [mainnet, polygon, optimism, goerli, polygonMumbai, sepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  })
)

// ConnectKit CSS overrides
// https://docs.family.co/connectkit/theming#theme-variables
export const connectKitTheme = {
  '--ck-font-family': 'var(--font-family-base)',
  '--ck-border-radius': 'var(--border-radius)',
  '--ck-overlay-background': 'var(--background-body-transparent)',
  '--ck-modal-box-shadow': '0 0 20px 20px var(--box-shadow-color)',
  '--ck-body-background': 'var(--background-body)',
  '--ck-body-color': 'var(--font-color-text)',
  '--ck-primary-button-border-radius': 'var(--border-radius)',
  '--ck-primary-button-color': 'var(--font-color-heading)',
  '--ck-primary-button-background': 'var(--background-content)',
  '--ck-secondary-button-border-radius': 'var(--border-radius)'
}

export function accountTruncate(account: string): string {
  if (!account || account === '') return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export async function addTokenToWallet(
  address: string,
  symbol: string,
  logo?: string
): Promise<void> {
  const image =
    logo ||
    'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'

  const tokenMetadata = {
    type: 'ERC20',
    options: { address, symbol, image, decimals: 18 }
  }

  ;(window?.ethereum.request as any)(
    {
      method: 'wallet_watchAsset',
      params: tokenMetadata,
      id: Math.round(Math.random() * 100000)
    },
    (err: { code: number; message: string }, added: any) => {
      if (err || 'error' in added) {
        LoggerInstance.error(
          `Couldn't add ${tokenMetadata.options.symbol} (${
            tokenMetadata.options.address
          }) to MetaMask, error: ${err.message || added.error}`
        )
      } else {
        LoggerInstance.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}

export async function addCustomNetwork(
  web3Provider: any,
  network: EthereumListsChain
): Promise<void> {
  // Always add explorer URL from ocean.js first, as it's null sometimes
  // in network data
  const blockExplorerUrls = [
    getOceanConfig(network.networkId).explorerUri,
    network.explorers && network.explorers[0].url
  ]

  const newNetworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: getNetworkDisplayName(network),
    nativeCurrency: network.nativeCurrency,
    rpcUrls: network.rpc,
    blockExplorerUrls
  }
  try {
    await web3Provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newNetworkData.chainId }]
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      await web3Provider.request(
        {
          method: 'wallet_addEthereumChain',
          params: [newNetworkData]
        },
        (err: string, added: any) => {
          if (err || 'error' in added) {
            LoggerInstance.error(
              `Couldn't add ${network.name} (0x${
                network.chainId
              }) network to MetaMask, error: ${err || added.error}`
            )
          } else {
            LoggerInstance.log(
              `Added ${network.name} (0x${network.chainId}) network to MetaMask`
            )
          }
        }
      )
    } else {
      LoggerInstance.error(
        `Couldn't add ${network.name} (0x${network.chainId}) network to MetaMask, error: ${switchError}`
      )
    }
  }
  LoggerInstance.log(
    `Added ${network.name} (0x${network.chainId}) network to MetaMask`
  )
}

export async function getTokenBalance(
  accountId: string,
  decimals: number,
  tokenAddress: string,
  web3Provider: ethers.providers.Provider
): Promise<string> {
  if (!web3Provider || !accountId || !tokenAddress) return

  try {
    const token = new Contract(tokenAddress, erc20ABI, web3Provider)
    const balance = await token.balanceOf(accountId)
    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`
    return formatEther(adjustedDecimalsBalance)
  } catch (e) {
    LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`)
  }
}

export function getTokenBalanceFromSymbol(
  balance: UserBalance,
  symbol: string
): string {
  if (!symbol) return

  const baseTokenBalance = balance?.[symbol.toLocaleLowerCase()]
  return baseTokenBalance || '0'
}
