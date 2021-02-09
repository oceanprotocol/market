import React, { ReactElement, useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'
import { Logger } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'

const refreshInterval = 5000 // 5 sec.
export function NetworkMonitor(): ReactElement {
  const {
    connect,
    web3Provider,
    web3,
    networkId,
    config,
    refreshBalance,
    account
  } = useOcean()

  async function handleNetworkChanged(chainId: string | number) {
    const initialNewConfig = getOceanConfig(
      typeof chainId === 'string' ? Number(chainId.replace('0x', '')) : chainId
    )

    const newConfig = {
      ...initialNewConfig,

      // add local dev values
      ...(chainId === '8996' && {
        factoryAddress: contractAddresses.development?.DTFactory,
        poolFactoryAddress: contractAddresses.development?.BFactory,
        fixedRateExchangeAddress:
          contractAddresses.development?.FixedRateExchange,
        metadataContractAddress: contractAddresses.development?.Metadata,
        oceanTokenAddress: contractAddresses.development?.Ocean
      })
    }

    try {
      await connect(newConfig)
    } catch (error) {
      Logger.error(error.message)
    }
  }
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
  // useEffect(() => {
  //   if (!web3 || !networkId) return

  //   async function init() {
  //     if (
  //       (await web3.eth.getChainId()) ===
  //       (config as ConfigHelperConfig).networkId
  //     )
  //       return

  //     await handleNetworkChanged(networkId)
  //   }
  //   init()
  // }, [web3, networkId])

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
