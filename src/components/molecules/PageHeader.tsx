import React, { ReactElement } from 'react'
import {
  header,
  center as centerStyle,
  title as titleStyle,
  description as descriptionStyle
} from './PageHeader.module.css'

export default function PageHeader({
  title,
  description,
  center
}: {
  title: string
  description?: string
  center?: boolean
}): ReactElement {
  return (
    <header className={`${header} ${center && centerStyle}`}>
      <h1 className={titleStyle}>{title}</h1>
      {description && <p className={descriptionStyle}>{description}</p>}
    </header>
  )
}
