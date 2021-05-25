import React, { ReactElement, ReactNode } from 'react'
import { item, olItem, ulItem } from './Lists.module.css'

export function ListItem({
  children,
  ol
}: {
  children: ReactNode
  ol?: boolean
}): ReactElement {
  const classes = ol ? `${item} ${olItem}` : `${item} ${ulItem}`

  return (
    <li className={classes}>
      <span>{children}</span>
    </li>
  )
}
