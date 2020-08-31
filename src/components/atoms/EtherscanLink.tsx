import React, { ReactElement, ReactNode } from 'react'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './EtherscanLink.module.css'

export default function EtherscanLink({
  network,
  path,
  children
}: {
  network?: 'rinkeby' | 'kovan' | 'ropsten'
  path: string
  children: ReactNode
}): ReactElement {
  const url = network
    ? `https://${network}.etherscan.io`
    : `https://etherscan.io`

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
