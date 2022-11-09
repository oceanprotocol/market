import { toDataUrl } from 'myetherwallet-blockies'
import React, { ReactElement } from 'react'
import styles from './index.module.css'

export interface AvatarProps {
  accountId: string
  src?: string
  className?: string
}

export default function Avatar({
  accountId,
  src,
  className
}: AvatarProps): ReactElement {
  return (
    <img
      className={`${className || ''} ${styles.avatar} `}
      src={src || (accountId ? toDataUrl(accountId) : '')}
      alt="Avatar"
      aria-hidden="true"
    />
  )
}
