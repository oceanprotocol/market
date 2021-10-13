import React from 'react'

import styles from './SearchFilterSection.module.css'

const SearchFilterSection = ({
  title,
  children
}: {
  title?: string
  children: React.ReactNode
}) => {
  return (
    <div className={styles.filterSection}>
      {title ? <h4>{title}</h4> : null}
      {children}
    </div>
  )
}

export default SearchFilterSection
