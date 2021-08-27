import { Link } from 'gatsby'
import React, { ReactElement, ReactNode } from 'react'

export default function LinkOpener({
  uri,
  className,
  openNewTab,
  children
}: {
  uri: string
  className?: string
  openNewTab?: boolean
  children?: ReactNode
}): ReactElement {
  return openNewTab ? (
    <a
      href={uri}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link to={uri} className={className}>
      {children}
    </Link>
  )
}
