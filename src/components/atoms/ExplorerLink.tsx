import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { ReactComponent as External } from '../../images/external.svg'
import classNames from 'classnames/bind'
import { ConfigHelperConfig } from '@oceanprotocol/lib'
import { useOcean } from '../../providers/Ocean'
import styles from './ExplorerLink.module.css'

const cx = classNames.bind(styles)

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

  const styleClasses = cx({
    link: true,
    [className]: className
  })

  useEffect(() => {
    setUrl((config as ConfigHelperConfig).explorerUri)
  }, [config])

  return (
    <a
      href={`${url}/${path}`}
      title={`View on ${(config as ConfigHelperConfig).explorerUri}`}
      target="_blank"
      rel="noreferrer"
      className={styleClasses}
    >
      {children} <External />
    </a>
  )
}
