import { toDataUrl } from 'myetherwallet-blockies'
import React, { ReactElement } from 'react'
import styles from './Blockies.module.css'

export default function Blockies({
  accountId,
  className
}: {
  accountId: string
  className?: string
}): ReactElement {
  if (!accountId) return null
  const blockies = toDataUrl(accountId)

  return (
    <img
      className={`${className || ''} ${styles.blockies} `}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}
