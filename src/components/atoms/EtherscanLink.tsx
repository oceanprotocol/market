import React, { ReactElement, ReactNode } from 'react'
import { getNetworkName } from '../../utils/wallet'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './EtherscanLink.module.css'

export default function EtherscanLink({
  networkId,
  path,
  children
}: {
  networkId: number
  path: string
  children: ReactNode
}): ReactElement {
  const url =
    networkId === 1
      ? `https://etherscan.io`
      : `https://${getNetworkName(networkId).toLowerCase()}.etherscan.io`

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
