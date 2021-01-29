import React, { ReactElement, useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'
import { Logger } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

export function NetworkMonitor(): ReactElement {
  const {
    connect,
    web3Provider,
    web3,
    networkId,
    config,
    accountId
  } = useOcean()

  async function handleNetworkChanged(chainId: string | number) {
    const initialNewConfig = getOceanConfig(
      typeof chainId === 'string' ? Number(chainId.replace('0x', '')) : chainId
    )

    const newConfig = {
      ...initialNewConfig,

      // add local dev values
      ...(chainId === '8996' && {
        factoryAddress: '0x312213d6f6b5FCF9F56B7B8946A6C727Bf4Bc21f',
        poolFactoryAddress: '0xF9E633CBeEB2A474D3Fe22261046C99e805beeC4',
        fixedRateExchangeAddress: '0xefdcb16b16C7842ec27c6fdCf56adc316B9B29B8',
        metadataContractAddress: '0xEBe77E16736359Bf0F9013F6017242a5971cAE76'
      })
    }

    try {
      await connect(newConfig)
    } catch (error) {
      Logger.error(error.message)
    }
  }

  // Re-connect on mount when network is different from user network.
  // Bit nasty to just overwrite the initialConfig passed to OceanProvider
  // while it's connecting to that, but YOLO.
  useEffect(() => {
    if (!web3 || !networkId) return

    async function init() {
      if (
        (await web3.eth.getChainId()) ===
        (config as ConfigHelperConfig).networkId
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
