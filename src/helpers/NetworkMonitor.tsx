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
