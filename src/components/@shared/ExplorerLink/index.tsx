import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import External from '@images/external.svg'
import classNames from 'classnames/bind'
import { Config } from '@oceanprotocol/lib'
import styles from './index.module.css'
import { getOceanConfig } from '@utils/ocean'

const cx = classNames.bind(styles)

export interface ExplorerLinkProps {
  networkId: number
  path: string
  children: ReactNode
  className?: string
}

export default function ExplorerLink({
  networkId,
  path,
  children,
  className
}: ExplorerLinkProps): ReactElement {
  const [url, setUrl] = useState<string>()
  const [oceanConfig, setOceanConfig] = useState<Config>()
  const styleClasses = cx({
    link: true,
    [className]: className
  })

  useEffect(() => {
    if (!networkId) return

    const oceanConfig = getOceanConfig(networkId)
    setOceanConfig(oceanConfig)
    setUrl(oceanConfig?.explorerUri)
  }, [networkId])

  return (
    <a
      href={`${url}/${path}`}
      title={`View on ${oceanConfig?.explorerUri}`}
      target="_blank"
      rel="noreferrer"
      className={styleClasses}
    >
      {children} <External />
    </a>
  )
}
