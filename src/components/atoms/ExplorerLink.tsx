import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './ExplorerLink.module.css'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useOcean } from '../../providers/Ocean'

export default function ExplorerLink({
  path,
  children
}: {
  networkId: number
  path: string
  children: ReactNode
}): ReactElement {
  const { config } = useOcean()
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    setUrl((config as ConfigHelperConfig).explorerUri)
  }, [config])

  return (
    <a
      href={`${url}/${path}`}
      title={`View on ${(config as ConfigHelperConfig).explorerUri}`}
      target="_blank"
      rel="noreferrer"
      className={styles.link}
    >
      {children} <External />
    </a>
  )
}
