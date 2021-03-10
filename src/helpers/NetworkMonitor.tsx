import React, { ReactElement, useEffect } from 'react'
import { getOceanConfig } from './wrapRootElement'
import { Logger } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'
import { useOcean } from '../providers/Ocean'
import { useWeb3 } from '../providers/Web3'

const refreshInterval = 5000 // 5 sec.

export function getDevelopmentConfig(): Partial<ConfigHelperConfig> {
  return {
    factoryAddress: contractAddresses.development?.DTFactory,
    poolFactoryAddress: contractAddresses.development?.BFactory,
    fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    metadataContractAddress: contractAddresses.development?.Metadata,
    oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Rinkeby one for now
    subgraphUri: 'https://subgraph.rinkeby.oceanprotocol.com'
  }
}

export function NetworkMonitor(): ReactElement {
  const { web3Provider, web3, networkId } = useWeb3()
  const { connect, config, refreshBalance, account } = useOcean()

  async function handleNetworkChanged(chainId: string | number) {
    const initialNewConfig = getOceanConfig(
      typeof chainId === 'string' ? Number(chainId.replace('0x', '')) : chainId
    )

    const newConfig = {
      ...initialNewConfig,

      // add local dev values
      ...(chainId === '8996' && {
        ...getDevelopmentConfig()
      })
    }

    try {
      await connect(newConfig)
    } catch (error) {
      Logger.error(error.message)
    }
  }

  // Periodically refresh wallet balance
  useEffect(() => {
    if (!account) return

    refreshBalance()
    const balanceInterval = setInterval(() => refreshBalance(), refreshInterval)

    return () => {
      clearInterval(balanceInterval)
    }
  }, [networkId, account])

  // Re-connect on mount when network is different from user network.
  // Bit nasty to just overwrite the initialConfig passed to OceanProvider
  // while it's connecting to that, but YOLO.
  useEffect(() => {
    if (!web3 || !networkId) return

    async function init() {
      const chainIdWeb3 = await web3.eth.getChainId()
      const chainIdConfig = (config as ConfigHelperConfig).networkId

      // HEADS UP! MetaMask built-in `Localhost 8545` network selection
      // will have `1337` as chainId but we use `8996` in our config
      if (
        chainIdWeb3 === chainIdConfig ||
        (chainIdWeb3 === 1337 && chainIdConfig === 8996)
      )
        return

      await handleNetworkChanged(networkId)
    }
    init()
  }, [web3, networkId])

  // Handle network change events
  useEffect(() => {
    if (!web3Provider) return

    web3Provider.on('chainChanged', handleNetworkChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleNetworkChanged)
    }
  }, [web3Provider])

  return <></>
}
