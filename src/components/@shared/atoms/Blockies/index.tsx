import { toDataUrl } from 'myetherwallet-blockies'
import React, { ReactElement } from 'react'
import styles from './index.module.css'

export interface BlockiesProps {
  accountId: string
  className?: string
  image?: string
}

export default function Blockies({
  accountId,
  className,
  image
}: BlockiesProps): ReactElement {
  if (!accountId) return null

  const blockies = toDataUrl(accountId)

  return (
    <img
      className={`${className || ''} ${styles.blockies} `}
      src={image || blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}
