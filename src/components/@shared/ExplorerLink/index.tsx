import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import External from '@images/external.svg'
import classNames from 'classnames/bind'
import { Config } from '@oceanprotocol/lib'
import { useOcean } from '@context/Ocean'
import styles from './index.module.css'
import { getOceanConfig } from '@utils/ocean'

const cx = classNames.bind(styles)

export default function ExplorerLink({
  networkId,
  path,
  children,
  className
}: {
  networkId: number
  path: string
  children: ReactNode
  className?: string
}): ReactElement {
  const { config } = useOcean()
  const [url, setUrl] = useState<string>()
  const [oceanConfig, setOceanConfig] = useState<Config>()
  const styleClasses = cx({
    link: true,
    [className]: className
  })

  useEffect(() => {
    if (!networkId) return

    async function initOcean() {
      const oceanInitialConfig = getOceanConfig(networkId)
      setOceanConfig(oceanInitialConfig)
      setUrl(oceanInitialConfig?.explorerUri)
    }
    if (oceanConfig === undefined) {
      initOcean()
    }
  }, [config, oceanConfig, networkId])

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
