import React, { ReactElement, ReactNode } from 'react'
import {
  metaItem,
  title as titleStyle,
  content as contentStyle
} from './MetaItem.module.css'

export default function MetaItem({
  title,
  content
}: {
  title: string
  content: ReactNode
}): ReactElement {
  return (
    <div className={metaItem}>
      <h3 className={titleStyle}>{title}</h3>
      <div className={contentStyle}>{content}</div>
    </div>
  )
}
