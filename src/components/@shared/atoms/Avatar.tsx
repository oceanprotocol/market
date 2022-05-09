import { toDataUrl } from 'myetherwallet-blockies'
import React, { ReactElement } from 'react'
<<<<<<<< HEAD:src/components/@shared/atoms/Blockies/index.tsx
import styles from './index.module.css'

export interface BlockiesProps {
  accountId: string
  className?: string
}
========
import styles from './Avatar.module.css'
>>>>>>>> 0ccc0380 (get all profile metadata with ENS):src/components/@shared/atoms/Avatar.tsx

export default function Avatar({
  accountId,
  ensAvatar,
  className
<<<<<<<< HEAD:src/components/@shared/atoms/Blockies/index.tsx
}: BlockiesProps): ReactElement {
========
}: {
  accountId: string
  ensAvatar?: string
  className?: string
}): ReactElement {
>>>>>>>> 0ccc0380 (get all profile metadata with ENS):src/components/@shared/atoms/Avatar.tsx
  if (!accountId) return null

  return (
    <img
      className={`${className || ''} ${styles.avatar} `}
      src={ensAvatar || toDataUrl(accountId)}
      alt="Avatar"
      aria-hidden="true"
    />
  )
}
