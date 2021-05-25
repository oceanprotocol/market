import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ReactComponent as External } from '../../images/external.svg'
import { ConfigHelperConfig } from '@oceanprotocol/lib'
import { useOcean } from '../../providers/Ocean'
import { link } from './ExplorerLink.module.css'

export default function ExplorerLink({
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

  useEffect(() => {
    setUrl((config as ConfigHelperConfig).explorerUri)
  }, [config])

  return (
    <a
      href={`${url}/${path}`}
      title={`View on ${(config as ConfigHelperConfig).explorerUri}`}
      target="_blank"
      rel="noreferrer"
      className={`${link} ${className}`}
    >
      {children} <External />
    </a>
  )
}
