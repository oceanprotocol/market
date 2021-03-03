import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { getNetworkData } from '../../utils/wallet'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './EtherscanLink.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import axios from 'axios'

export default function EtherscanLink({
  networkId,
  path,
  children
}: {
  networkId: number
  path: string
  children: ReactNode
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const [network, setNetwork] = useState<string>()

  useEffect(() => {
    const source = axios.CancelToken.source()

    async function init() {
      const network = await getNetworkData(networkId, source.token)
      setNetwork(network.data.network)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [networkId])

  const url =
    (!networkId && appConfig.network === 'mainnet') || networkId === 1
      ? `https://etherscan.io`
      : `https://${networkId ? network : appConfig.network}.etherscan.io`

  return (
    <a
      href={`${url}/${path}`}
      title="View on Etherscan"
      target="_blank"
      rel="noreferrer"
      className={styles.link}
    >
      {children} <External />
    </a>
  )
}
