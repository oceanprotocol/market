import React from 'react'
import useCategoriesQueryParams from '../../hooks/useCategoriesQueryParams'
import SearchFilterSection from '../atoms/SearchFilterSection'
import Checkbox from '../atoms/Checkbox'
import { CATEGORIES } from '../../models/PublishForm'

import styles from './SearchCategoriesFilter.module.css'

const SearchCategoriesFilter = () => {
  const { selectedCategories, toggleCategory } = useCategoriesQueryParams(
    CATEGORIES
  )

  return (
    <SearchFilterSection title="Filter by type">
      <ul>
        {CATEGORIES.map(category => (
          <li key={category} className={styles.optionItem}>
            <Checkbox
              name={category}
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              label={category}
            />
          </li>
        ))}
      </ul>
    </SearchFilterSection>
  )
}

export default SearchCategoriesFilter
