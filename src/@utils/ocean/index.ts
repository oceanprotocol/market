import { ConfigHelper, Config } from '@oceanprotocol/lib'
// import { Config } from '@oceanprotocol/ddo-js'
import { ethers } from 'ethers'
import abiDatatoken from '@oceanprotocol/contracts/artifacts/contracts/templates/ERC20TemplateEnterprise.sol/ERC20TemplateEnterprise.json'

/**
  This function takes a Config object as an input and returns a new sanitized Config object
  The new Config object has the same properties as the input object, but with some values replaced by environment variables if they exist
  Also adds missing contract addresses deployed when running barge locally
  @param {Config} config - The input Config object
  @returns {Config} A new Config object
*/
export function sanitizeDevelopmentConfig(config: Config): Config {
  return {
    nodeUri: process.env.NEXT_PUBLIC_NODE_URI || config.nodeUri,
    oceanNodeUri: process.env.NEXT_PUBLIC_PROVIDER_URL || config.oceanNodeUri,
    fixedRateExchangeAddress:
      process.env.NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS,
    dispenserAddress: process.env.NEXT_PUBLIC_DISPENSER_ADDRESS,
    oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
    nftFactoryAddress: process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS,
    routerFactoryAddress: process.env.NEXT_PUBLIC_ROUTER_FACTORY_ADDRESS,
    accessListFactory: process.env.NEXT_PUBLIC_ACCESS_LIST_FACTORY_ADDRESS
  } as Config
}

export function getOceanConfig(network: string | number): Config {
  if (!network) {
    console.warn('getOceanConfig: called with undefined network')
    return undefined
  }
  let config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 8996
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  if (network === 8996) {
    config = { ...config, ...sanitizeDevelopmentConfig(config) }
  }

  // Override RPC URL for Sepolia if it's set (the reason is ocean.js supports only infura)
  if (network === 11155111 && process.env.NEXT_PUBLIC_NODE_URI) {
    config.nodeUri = process.env.NEXT_PUBLIC_NODE_URI
    // config.oceanNodeUri = process.env.NEXT_PUBLIC_NODE_URL
  }

  return config as Config
}

export function getDevelopmentConfig(): Config {
  return {
    // factoryAddress: contractAddresses.development?.DTFactory,
    // poolFactoryAddress: contractAddresses.development?.BFactory,
    // fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    // metadataContractAddress: contractAddresses.development?.Metadata,
    // oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Sepolia one for now
    // subgraphUri: 'https://v4.subgraph.sepolia.oceanprotocol.com'
  } as Config
}

/**
 * getPaymentCollector - returns the current paymentCollector
 * @param dtAddress datatoken address
 * @param provider the ethers.js web3 provider
 * @return {Promise<string>}
 */
export async function getPaymentCollector(
  dtAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const dtContract = new ethers.Contract(dtAddress, abiDatatoken.abi, provider)
  const paymentCollector = await dtContract.getPaymentCollector()
  return paymentCollector
}
