import { toDataUrl } from 'ethereum-blockies'
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

  // TODO: just put this back once finished
  // const blockies = toDataUrl(accountId)
  const blockies = 'randomstring12345'

  return (
    <img
      className={`${styles.blockies} ${className || ''}`}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}
