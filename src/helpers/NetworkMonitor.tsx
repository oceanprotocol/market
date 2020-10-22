import React, { ReactElement, useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'
import appConfig from '../../app.config'
import { Logger } from '@oceanprotocol/lib'

export function NetworkMonitor(): ReactElement {
  const { metadataCacheUri } = appConfig
  const { connect, web3Provider } = useOcean()

  useEffect(() => {
    if (!web3Provider) return

    async function handleNetworkChanged(chainId: string) {
      const initialConfig = getOceanConfig(Number(chainId.replace('0x', '')))

      const newConfig = {
        ...initialConfig,
        // add metadataCacheUri only when defined
        ...(metadataCacheUri && { metadataCacheUri })
      }
      if (chainId === '8996') {
        newConfig.factoryAddress = '0x312213d6f6b5FCF9F56B7B8946A6C727Bf4Bc21f'
        newConfig.poolFactoryAddress =
          '0xF9E633CBeEB2A474D3Fe22261046C99e805beeC4'
        newConfig.fixedRateExchangeAddress =
          '0xefdcb16b16C7842ec27c6fdCf56adc316B9B29B8'
        newConfig.metadataContractAddress =
          '0xEBe77E16736359Bf0F9013F6017242a5971cAE76'
      }

      try {
        await connect(newConfig)
      } catch (error) {
        Logger.error(error.message)
      }
    }

    web3Provider.on('chainChanged', handleNetworkChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleNetworkChanged)
    }
  }, [web3Provider, connect, metadataCacheUri])

  return <></>
}
