import React, { ReactElement } from 'react'
import { filterSection } from './SearchFilterSection.module.css'

const SearchFilterSection = ({
  title,
  children
}: {
  title?: string
  children: React.ReactNode
}): ReactElement => {
  return (
    <div className={filterSection}>
      {title ? <h4>{title}</h4> : null}
      {children}
    </div>
  )
}

export default SearchFilterSection
