import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ReactComponent as External } from '../../images/external.svg'
import classNames from 'classnames/bind'
import { ConfigHelperConfig } from '@oceanprotocol/lib'
import { useOcean } from '../../providers/Ocean'
import styles from './ExplorerLink.module.css'
import { getOceanConfig } from '../../utils/ocean'

const cx = classNames.bind(styles)

export default function ExplorerLink({
  networkId,
  path,
  children,
  className
}: {
  networkId: number
  path: string
  children?: ReactNode
  className?: string
}): ReactElement {
  const { config, ocean } = useOcean()
  const [url, setUrl] = useState<string>()
  const [oceanConfig, setOceanConfig] = useState<ConfigHelperConfig>()
  const styleClasses = cx({
    link: true,
    [className]: className
  })

  useEffect(() => {
    async function initOcean() {
      const oceanInitialConfig = getOceanConfig(networkId)
      setOceanConfig(oceanInitialConfig)
      setUrl(oceanInitialConfig?.explorerUri)
    }
    if (oceanConfig === undefined) {
      initOcean()
    }
  }, [config, networkId, ocean])

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
