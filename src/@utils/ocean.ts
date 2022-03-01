import { ConfigHelper, LoggerInstance, Config } from '@oceanprotocol/lib'
// import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'
import { AbiItem } from 'web3-utils/types'
import Web3 from 'web3'

export function getOceanConfig(network: string | number): Config {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  // TODO: remove hack once address is fixed
  if (network === 'rinkeby' || network === 4)
    config.oceanTokenAddress = '0x8967bcf84170c91b0d24d4302c2376283b0b3a07'
  return config as Config
}

export function getDevelopmentConfig(): Config {
  return {
    // factoryAddress: contractAddresses.development?.DTFactory,
    // poolFactoryAddress: contractAddresses.development?.BFactory,
    // fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    // metadataContractAddress: contractAddresses.development?.Metadata,
    // oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Rinkeby one for now
    subgraphUri: 'https://v4.subgraph.rinkeby.oceanprotocol.com'
  } as Config
}

export async function getOceanBalance(
  accountId: string,
  networkId: number,
  web3: Web3
): Promise<string> {
  const minABI = [
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ] as AbiItem[]

  try {
    const token = new web3.eth.Contract(
      minABI,
      getOceanConfig(networkId).oceanTokenAddress,
      { from: accountId }
    )
    const result = web3.utils.fromWei(
      await token.methods.balanceOf(accountId).call()
    )
    return result
  } catch (e) {
    LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`)
  }
}
