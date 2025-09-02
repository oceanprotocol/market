import { LoggerInstance } from '@oceanprotocol/lib'
import {
  Contract,
  Signer,
  JsonRpcProvider,
  Wallet,
  Provider,
  isAddress,
  formatEther
} from 'ethers'
import { getNetworkDisplayName } from '@hooks/useNetworkMetadata'
import { getOceanConfig } from '../ocean'
import erc20ABI from '@oceanprotocol/contracts/artifacts/contracts/templates/ERC20Template.sol/ERC20Template.json'

export async function getDummySigner(chainId: number): Promise<Signer> {
  if (typeof chainId !== 'number') {
    throw new Error('Chain ID must be a number')
  }

  // Get config from ocean lib
  const config = getOceanConfig(chainId)
  try {
    const privateKey =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const provider = new JsonRpcProvider(config.nodeUri, config.chainId)
    return new Wallet(privateKey, provider)
  } catch (error) {
    throw new Error(`Failed to create dummy signer: ${error.message}`)
  }
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
  web3Provider: Provider
): Promise<string | undefined> {
  if (!web3Provider || !accountId || !tokenAddress) return

  try {
    if (!isAddress(tokenAddress)) {
      LoggerInstance.warn(`Invalid token address: ${tokenAddress}`)
      return
    }

    const code = await web3Provider.getCode(tokenAddress)
    if (code === '0x') {
      LoggerInstance.warn(`No contract found at token address: ${tokenAddress}`)
      return
    }

    const token = new Contract(tokenAddress, erc20ABI.abi, web3Provider)
    const balance = await token.balanceOf(accountId)

    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`
    return formatEther(adjustedDecimalsBalance)
  } catch (e: any) {
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
